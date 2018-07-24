import React, { Component } from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

/**
 * Base form field class HOC
 */
export const formField = function (WrappedComponent) {
  class formFieldClass extends Component {
    onChange = (e) => {
      const value = e.target.value;
      this.props.fieldProps.onChange(e, this.props.name, value);
    }

    render() {
      const { fieldProps, name, defaultValue, ...rest } = this.props;
      const defaults = {
        value: typeof defaultValue !== 'undefined' ? defaultValue : '',
        error: false,
      };
      const theseFieldProps = { ...defaults, ...fieldProps.fields[name] };

      return <WrappedComponent onChange={this.onChange} {...theseFieldProps} {...rest} />;
    }
  }
  formFieldClass.propTypes = {
    fieldProps: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.any,
  };
  formFieldClass.defaultProps = {
    defaultValue: undefined,
  };

  return formFieldClass;
};

/**
 * TextField
 */
const textFieldStyles = {
  errorHelpText: {
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
};
const TextFieldUnwrapped = ({ error, helperText, classes, ...rest }) => {
  const errorMessage = error;
  error = !!error;
  const helperTextWithError = (
    <span>
      <span className="helpText">{helperText}</span>
      {error
        ? <span className={classes.errorHelpText}><br /><br />{errorMessage}</span>
        : null}
    </span>
  );
  return <MuiTextField error={error} helperText={helperTextWithError} {...rest} />;
};
TextFieldUnwrapped.propTypes = {
  error: PropTypes.any,
  helperText: PropTypes.string,
  classes: PropTypes.object.isRequired,
};
TextFieldUnwrapped.defaultProps = {
  error: undefined,
  helperText: undefined,
};
export const TextField = withStyles(textFieldStyles)(formField(TextFieldUnwrapped));
