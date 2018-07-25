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
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, fieldProps, render, document, save } = this.props;

    return (
      <div>
        <Button onClick={this.handleOpen}>Edit</Button>
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
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
  // documentType: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};
MutationModal.defaultProps = {
  document: null,
};

export default function ExportComponent({ document, documentType, ...rest }) {
  const ComposedComponent = compose(
    withStyles(styles),
    withMutation(documentType, document),
  )(MutationModal);
  return <ComposedComponent {...rest} />;
}
ExportComponent.propTypes = {
  document: PropTypes.object,
  documentType: PropTypes.string.isRequired,
};
ExportComponent.defaultProps = {
  document: null,
};
