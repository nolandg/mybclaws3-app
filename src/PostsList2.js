import React, { Component } from 'react';
import { Query, withApollo, compose } from 'react-apollo';
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

class PostsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variables: {
        start: 0,
        limit: 2,
      },
      increment: 1,
    };
    register(this.refetch);
  }

  refetch = () => {
    console.log('fetching with vars: ', this.state.variables);
    if(this.refetch) this.refetch(this.state.variables);
  }

  renderPost = post => (
    <div key={post._id}>
      Title: {post.title}
    </div>
  )

  handleLoadMore = () => {
    this.setState(({ variables }) => {
      variables.limit += 1;
      return { variables };
    }, () => {
      const { variables } = this.state;
      this.refetch(variables);
    });
  }

  renderProp = ({ loading, error, data, fetchMore, refetch }) => {
    if(loading) return 'Waiting for data...';
    if(error) {
      console.error('Error getting data in component: ', error);
      return (
        <div>
          Error: {gqlError(error).message}
        </div>
      );
    }
    if(!data.posts) return 'no data :-(';

    this.refetch = refetch;

    return (
      <div>
        <Typography variant="display3" gutterBottom>
          Posts List 2
        </Typography>
        <AddPost />
        {data.posts.map(post => this.renderPost(post))}
        <Button variant="contained" color="primary" onClick={() => this.handleLoadMore(fetchMore)}>
          <AddIcon />Load more
        </Button>
      </div>
    );
  }

  render() {
    return <Query query={POSTS_QUERY} variables={this.state.variables} children={this.renderProp} />;
  }
}

PostsList.propTypes = {
  // data: PropTypes.object.isRequired,
};

export default compose(
  withApollo,
)(PostsList);
