import React, { Component } from 'react';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';


import { withMutation } from 'lapki/build/lib/HOCs'; // eslint-disable-line import/no-extraneous-dependencies
import { TextField } from 'lapki/build/lib/components'; // eslint-disable-line import/no-extraneous-dependencies

import PostCollection from '../collections/Post';

const styles = () => ({
  addPostRoot: {
    flexDirection: 'column',
  },
  addPostButton: {
    maxWidth: '15em',
    alignSelf: 'flex-end',
  },
});

class AddPost extends Component {
  handleAddPostClick = () => {
    this.props.save();
  }

  render() {
    const { classes, fieldProps } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="title">Add Postee</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.addPostRoot}>
          <TextField
            name="title"
            label="Title"
            helperText="Enter a descriptive title for this post"
            margin="normal"
            fieldProps={fieldProps}
          />
          <TextField
            name="name"
            label="Name"
            helperText="Enter a descriptive NAME for this post"
            margin="normal"
            fieldProps={fieldProps}
          />
          <br />
          <Button onClick={this.handleAddPostClick} className={classes.addPostButton} variant="contained" color="primary">
            <SaveIcon />Add a postee
          </Button>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
AddPost.propTypes = {
  classes: PropTypes.object.isRequired,
  fieldProps: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
};

AddPost.propTypes = {

};

const AddPostWithHOCs = compose(
  withMutation(),
  withStyles(styles),
)(AddPost);

export default props => <AddPostWithHOCs collection={PostCollection} {...props} />;
