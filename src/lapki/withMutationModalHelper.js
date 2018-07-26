import React from 'react';
import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
// import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button';
// import SaveIcon from '@material-ui/icons/Save';
// import Divider from '@material-ui/core/Divider';
// import { compose } from 'react-apollo';

import withMutation from './withMutation';

function withMutationModalHelper(WrappedComponent) {
  class withMutationModalHelperClass extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalOpen: false,
      };
    }

    handleOpen = () => {
      this.setState({ modalOpen: true });
    };

    handleClose = () => {
      console.log('i am closing now');
      this.setState({ modalOpen: false });
    };

    handleMutationSuccess = () => {
      this.handleClose();
      console.log('we are done!!');
    };

    render() {
      const { ...rest } = this.props;

      return (
        <WrappedComponent
          handleOpen={this.handleOpen}
          handleClose={this.handleClose}
          onMutationSuccess={this.handleMutationSuccess}
          modalOpen={this.state.modalOpen}
          {...rest}
        />
      );
    }
  }
  withMutationModalHelperClass.propTypes = {
    document: PropTypes.object,
    documentType: PropTypes.string.isRequired,
  };
  withMutationModalHelperClass.defaultProps = {
    document: null,
  };

  return withMutationModalHelperClass;
}

const withMutationModalHelperWithHOCs = WrappedComponent => withMutation()(withMutationModalHelper(WrappedComponent));

export default withMutationModalHelperWithHOCs;
