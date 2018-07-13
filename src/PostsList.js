import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import fetch from 'isomorphic-fetch';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import TablePagination from '@material-ui/core/TablePagination';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

import gqlError from './gqlError';

const QUERY = gql`
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

const QUERY2 = gql`
  query Users{
    users {
      _id
      username
    }
  }
`;

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
      this.props.client.query({
        query: QUERY,
        variables: {
          start: 0,
          limit: 3,
        },
        fetchPolicy: 'network-only',
      });
      this.props.client.query({
        query: QUERY2,
        fetchPolicy: 'network-only',
      });
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

// const AddPost = (withApollo(AddPostInner));
const AddPost = withStyles(styles)(withApollo(AddPostInner));

class PostsList extends Component {
  renderPost = post => (
    <Card key={post._id} className="post">
      <CardContent>
        <Typography gutterBottom variant="headline" component="h2">
          {post.title}
        </Typography>
        <Typography component="p">
          {post.body}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary">
          <SaveIcon />Change shit
        </Button>
      </CardActions>
    </Card>
  )

  handleChangeRowsPerPage = () => {

  }

  handleChangePage = () => {

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
        <TablePagination
          component="div"
          count={1}
          rowsPerPage={1}
          page={1}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </div>
    );
  }
}

PostsList.propTypes = {
  data: PropTypes.object.isRequired,
};

// export default Home;
export default withApollo(graphql(QUERY, {
  options: {
    errorPolicy: 'none',
    variables: {
      start: 0,
      limit: 3,
    },
  },
})(PostsList));
