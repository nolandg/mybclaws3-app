import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import fetch from 'isomorphic-fetch';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
// import CardContent from '@material-ui/core/CardContent';
// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import qatch from 'await-to-js';

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

const queryRegistry = [postsQuery, usersQuery];

// const runQueries = (client) => {
//   queryRegistry.forEach((q) => {
//     console.log('query: ', q);
//     const [error] = qatch(client.query({ query: q.query, variables: q.variables }));
//     if(error) {
//       console.error(error);
//     }
//   });
// };
const runQueries = (client) => {
  queryRegistry.forEach(async ({ query, variables }) => {
    console.log('query: ', query);
    const [error] = await qatch(client.query({ query, variables }));
    if(error) {
      console.error(error);
    }
  });
};

const styles = () => ({
  addPostRoot: {
    flexDirection: 'column',
  },
  addPostButton: {
    maxWidth: '15em',
    alignSelf: 'flex-end',
  },
});

class AddPostInner extends Component {
  state = {
    title: 'i am title',
  }

  handleAddPostClick = () => {
    fetch('http://localhost:1337/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.title,
      }),
    }).then(response => response.json()).then(() => {
      const { client } = this.props;
      runQueries(client);
    }).catch((error) => {
      console.error(error);
    });
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  }

  render() {
    const { classes } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="title">Add Post</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.addPostRoot}>
          <TextField
            onChange={this.handleTitleChange}
            value={this.state.title}
            name="title"
            label="Title"
            helperText="Enter a descriptive title for this post"
            margin="normal"
          />
          <br />
          <Button onClick={this.handleAddPostClick} className={classes.addPostButton} variant="contained" color="primary">
            <SaveIcon />Add a post
          </Button>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
AddPostInner.propTypes = {
  classes: PropTypes.object.isRequired,
};

AddPostInner.propTypes = {
  client: PropTypes.object.isRequired,
};

const AddPost = withStyles(styles)(withApollo(AddPostInner));

class PostsList extends Component {
  renderPost = post => (
    <div key={post._id}>
      Title: reddddwwwwwwds{post.title}
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

// export default Home;
export default withApollo(graphql(postsQuery.query, {
  options: {
    errorPolicy: 'none',
    variables: postsQuery.variables,
  },
})(PostsList));
