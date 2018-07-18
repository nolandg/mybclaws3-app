import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddPost from './AddPost';

import { register } from './queryRegistry';
import gqlError from './gqlError';


const POSTS_QUERY = gql`
  query Posts($start: Int, $limit: Int){
    posts(start: $start, limit: $limit) {
      _id
      title
      body
    },
  }
`;

const withRefetch = function (WrappedComponent, queryVariables) {
  class withRefetchClass extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        variables: queryVariables,
      };
      register(this.refetch);
    }

    refetch = () => {
      this.props.data.refetch(this.state.variables);
    }

    setVariables = (func, cb) => {
      if(typeof func !== 'function') {
        throw Error('You must pass a function to setVariables(). See React functional setState() for details');
      }
      this.setState(state => ({ variables: func(state.variables) }), () => {
        if(typeof cb === 'function') cb();
        this.refetch();
      });
    }

    getVariables = () => this.state.variables

    render() {
      return <WrappedComponent {...this.props} setVariables={this.setVariables} getVariables={this.getVariables} />;
    }
  }
  withRefetchClass.propTypes = {
    data: PropTypes.object.isRequired,
  };

  return withRefetchClass;
};


function withReactiveQuery(query, queryVariables, graphqlOptions) {
  const defaultOptions = {
    errorPolicy: 'none',
    variables: queryVariables,
  };
  const options = { ...defaultOptions, ...graphqlOptions };
  const config = {
    options,
  };

  return WrappedComponent => graphql(query, config)(withRefetch(WrappedComponent, queryVariables));
}


class PostsList extends Component {
  renderPost = post => (
    <div key={post._id}>
      Title: {post.title}
    </div>
  )

  handleLoadMore = () => {
    this.props.setVariables(({ start, limit }) => ({ start, limit: limit + 10 }));
  }

  render() {
    const { error, posts, networkStatus } = this.props.data;

    if(networkStatus === 1) {
      return 'Waiting for data...';
    }
    if(error) {
      console.error('Error getting data in component: ', error);
      return (
        <div>
          Error: {gqlError(error).message}
        </div>
      );
    }
    if(!posts) return 'no data :-(';

    return (
      <div>
        <Typography variant="display3" gutterBottom>
          Posts List 2
        </Typography>
        <AddPost />
        {posts.map(post => this.renderPost(post))}
        <Button variant="contained" color="primary" onClick={() => this.handleLoadMore()}>
          <AddIcon />Load more
        </Button>
      </div>
    );
  }
}

PostsList.propTypes = {
  data: PropTypes.object.isRequired,
  error: PropTypes.object,
  networkStatus: PropTypes.number,
  setVariables: PropTypes.func.isRequired,
};
PostsList.defaultProps = {
  error: undefined,
  networkStatus: 1,
};

export default withReactiveQuery(POSTS_QUERY, { start: 0, limit: 3 })(PostsList);
// export default graphql(POSTS_QUERY, { options: { variables: { start: 0, limit: 3 } } })(withRefetch(PostsList));
