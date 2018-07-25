import React, { Component } from 'react';
import MuiTextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

/**
 * Base form field class HOC
 */
const formFieldStyles = {
  errorHelpText: {
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
};
export const formField = function (WrappedComponent) {
  class formFieldClass extends Component {
    onChange = (e) => {
      const value = e.target.value;
      this.props.fieldProps.onChange(e, this.props.name, value);
    }

    render() {
      const { fieldProps, name, defaultValue, helperText, classes, ...rest } = this.props;
      const defaults = {
        value: typeof defaultValue !== 'undefined' ? defaultValue : '',
        error: false,
      };
      const theseFieldProps = { ...defaults, ...fieldProps.fields[name] };
      const { error } = theseFieldProps;

      const helperTextWithError = (
        <span>
          <span className="helpText">{helperText}</span>
          {error
            ? <span className={classes.errorHelpText}><br /><br />{error}</span>
            : null}
        </span>
      );

      delete theseFieldProps.touched;
      delete theseFieldProps.error;

      return (
        <WrappedComponent
          onChange={this.onChange}
          helperText={helperTextWithError}
          error={!!error}
          {...theseFieldProps}
          {...rest}
        />
      );
    }
  }
  formFieldClass.propTypes = {
    fieldProps: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.any,
    helperText: PropTypes.node,
    classes: PropTypes.object.isRequired,
  };
  formFieldClass.defaultProps = {
    defaultValue: undefined,
    helperText: '',
  };

  return withStyles(formFieldStyles)(formFieldClass);
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
const TextFieldUnstyled = ({ value, ...rest }) => {
  if(!value) value = '';
  return <MuiTextField value={value} {...rest} />;
};
TextFieldUnstyled.propTypes = {
  value: PropTypes.any,
};
TextFieldUnstyled.defaultProps = {
  value: '',
};
export const TextField = withStyles(textFieldStyles)(formField(TextFieldUnstyled));
