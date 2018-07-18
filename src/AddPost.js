import React, { Component } from 'react';
import { withApollo, compose } from 'react-apollo';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import SaveIcon from '@material-ui/icons/Save';
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

import { runQueries } from './strazzle/queryRegistry';

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
      runQueries();
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
  // client: PropTypes.object.isRequired,
};

const AddPost = compose(
  withApollo,
  withStyles(styles),
)(AddPostInner);

export default AddPost;
