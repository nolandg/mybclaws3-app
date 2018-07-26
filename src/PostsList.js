import React, { Component } from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { compose } from 'react-apollo';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
// import Divider from '@material-ui/core/Divider';
import { withReactiveQuery } from 'lapki'; // eslint-disable-line
import { withStyles } from '@material-ui/core/styles';

import AddPost from './AddPost';
import { TextField } from './lapki/FormFields';
import withMutationModalHelperClass from './lapki/withMutationModalHelper';

const POSTS_QUERY = gql`
  query Posts($start: Int, $limit: Int){
    posts(start: $start, limit: $limit) {
      _id
      title
      body
    },
  }
`;

const top = 50;
const left = 50;
const modalStyle = {
  top: `${top}%`,
  left: `${left}%`,
  transform: `translate(-${top}%, -${left}%)`,
};

const modalStyles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class EditModalNoHOCs extends Component {
  constructor(props) {
    super(props);
    console.log('EditModalNoHOCs constructor');
  }

  render() {
    const { modalOpen, handleClose, handleOpen, fieldProps, classes, save } = this.props;

    return (
      <div>
        <Button onClick={handleOpen} variant="contained" color="secondary"><EditIcon />Edit</Button>
        <Modal
          open={modalOpen}
          onClose={handleClose}
        >
          <div style={modalStyle} className={classes.paper}>
            <Typography variant="title" id="modal-title">
              Edit Modal
            </Typography>
            <TextField
              name="title"
              label="Title"
              helperText="Enter a descriptive title for this post"
              margin="normal"
              fieldProps={fieldProps}
            />
            <Button onClick={save} variant="contained" color="primary">
              <SaveIcon />Save
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}
EditModalNoHOCs.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  fieldProps: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
};
const EditModal = ({ document, documentType, ...rest }) => {
  // const C = compose(
  //   withStyles(modalStyles),
  //   withMutationModalHelperClass(documentType, document),
  // )(EditModalNoHOCs);
  // return <C document={document} documentType={documentType} {...rest} />;
  if(document === 234) return 234;
  return <SimpleComponent2 document={document} />;
};
EditModal.propTypes = {
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
};

class SimpleComponent2 extends Component {
  constructor(props) {
    super(props);
    console.log('SimpleComponent2 constructor');
  }

  render() {
    return <div>Title: {this.props.document.title}</div>;
  }
}
SimpleComponent2.propTypes = {
  document: PropTypes.object.isRequired,
};

class SimpleComponent extends Component {
  constructor(props) {
    super(props);
    console.log('SimpleComponent constructor');
  }

  render() {
    return <div>Title: {this.props.document.title}</div>;
  }
}
SimpleComponent.propTypes = {
  document: PropTypes.object.isRequired,
};

class PostsList extends Component {
  constructor(props) {
    super(props);
    console.log('PostsList constructor');
  }

  renderPost = post => (
    <div key={`${post._id}_oooooooo`}>
      <SimpleComponent document={post} key={post._id} />
      <div key={`${post._id}_ppppppppoop`}>
      Title: {post.title}
        <EditModal document={post} documentType="post" />
      </div>
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
          Possssssssssss
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
