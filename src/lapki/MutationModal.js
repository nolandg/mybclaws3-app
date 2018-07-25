import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Divider from '@material-ui/core/Divider';
import { compose } from 'react-apollo';

import withMutation from './withMutation';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class MutationModal extends React.Component {
  render() {
    const { classes, fieldProps, render, document, save, open, onClose, onOpen } = this.props;

    return (
      <div>
        <Button onClick={onOpen}>Edit</Button>
        <Modal
          open={open}
          onClose={onClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="title" id="modal-title">
              Mutation Modal
            </Typography>
            {render({
              fieldProps,
              document,
              closeModal: this.handleClose,
              save,
            })}
            <Divider />
            <Button onClick={save} variant="contained" color="primary">
              <SaveIcon />Save
            </Button>

          </div>
        </Modal>
      </div>
    );
  }
}

MutationModal.propTypes = {
  classes: PropTypes.object.isRequired,
  fieldProps: PropTypes.object.isRequired,
  document: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};
MutationModal.defaultProps = {
  document: null,
};

export default class MutationModalWrapper extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleMutationSuccess = () => {
    this.handleClose();
    console.log('we are done!!');
  };

  render() {
    const { document, documentType, ...rest } = this.props;
    const MutationModalWithHOCs = compose(
      withStyles(styles),
      withMutation(documentType, document),
    )(MutationModal);

    return (
      <MutationModalWithHOCs
        open={this.state.open}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        onMutationSuccess={this.handleMutationSuccess}
        {...rest}
      />
    );
  }
}
MutationModalWrapper.propTypes = {
  document: PropTypes.object,
  documentType: PropTypes.string.isRequired,
};
MutationModalWrapper.defaultProps = {
  document: null,
};
