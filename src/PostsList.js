import React, { Component } from 'react';
import { graphql, withApollo, compose } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import CardContent from '@material-ui/core/CardContent';
// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';


import AddPost from './AddPost';
import { register } from './queryRegistry';
import gqlError from './gqlError';


const postsQuery = {
  query: gql`
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
    }`,
  variables: {
    start: 0,
    limit: 3,
  },
};

const usersQuery = {
  query: gql`
    query Posts($start: Int, $limit: Int){
      users {
        _id
        username
      },
    }`,
};

register(postsQuery);
register(usersQuery);

class PostsList extends Component {
  renderPost = post => (
    <div key={post._id}>
      Title: {post.title}
    </div>
    // <Card key={post._id} className="post">
    //   <CardContent>
    //     <Typography gutterBottom variant="headline" component="h2">
    //       {post.title}
    //     </Typography>
    //     <Typography component="p">
    //       {post.body}
    //     </Typography>
    //   </CardContent>
    //   <CardActions>
    //     <Button variant="contained" color="primary">
    //       <SaveIcon />Change shit
    //     </Button>
    //   </CardActions>
    // </Card>
  )

  handleLoadMore = () => {
    const { fetchMore } = this.props.data;
    const { variables } = postsQuery;
    variables.limit += 2;
    fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          feed: [...prev.posts, ...fetchMoreResult.posts],
        });
      },
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
