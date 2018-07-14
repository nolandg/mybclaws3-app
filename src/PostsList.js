import React, { Component } from 'react';
import { graphql, withApollo, compose } from 'react-apollo';
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
    users {
      _id
      username
    }
  }
`;

class PostsList extends Component {
  renderPost = post => (
    <div key={post._id}>
      Title: {post.title}
    </div>
  )

  handleLoadMore = (fetchMore) => {
    this.setState(({ variables }) => {
      variables.start += variables.limit;
      return { variables };
    }, () => {
      const { variables } = this.state;

      fetchMore({
        variables,
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            posts: [...prev.posts, ...fetchMoreResult.posts],
          });
        },
      });
    });
  }

  render() {
    const { data } = this.props;
    const { loading, error } = data;

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

    return (
      <div>
        <Typography variant="display3" gutterBottom>
          Posts List
        </Typography>
        <AddPost />
        {data.posts.map(post => this.renderPost(post))}
        <Button variant="contained" color="primary" onClick={this.handleLoadMore}>
          <AddIcon />Load more
        </Button>
      </div>
    );
  }
}

PostsList.propTypes = {
  data: PropTypes.object.isRequired,
};

export default compose(
  withApollo,
  graphql(postsQuery.query, {
    options: {
      errorPolicy: 'none',
      variables: postsQuery.variables,
    },
  }),
)(PostsList);
