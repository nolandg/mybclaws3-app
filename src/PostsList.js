import React, { Component } from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddPost from './AddPost';

import withReactiveQuery from './strazzle/withReactiveQuery';

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
      return (
        <div>
          Error: {error.message}
        </div>
      );
    }
    if(!posts) return 'no data :-(';

    return (
      <div>
        <Typography variant="display3" gutterBottom>
          Posts List1ss22222222222222vsssssssssssssssssssssssssssssssss4444444
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
