import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import deepGet from 'lodash.get';
import deepSet from 'lodash.set';
import { queryManager } from 'lapki'; // eslint-disable-line import/no-extraneous-dependencies

const withMutation = function (WrappedComponent) {
  class withMutationClass extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fields: {},
        errors: [],
        firstSaveAttempted: false,
      };
    }

    componentDidMount = () => {
      this.setState({ firstSaveAttempted: false });
    }

    setFieldValue = (name, value, cb) => {
      this.setState((state) => {
        deepSet(state.fields, `${name}.value`, value);
        return state;
      }, cb);
    }

    setFieldError = (name, error, cb) => {
      this.setState((state) => {
        deepSet(state.fields, `${name}.error`, error);
        return state;
      }, cb);
    }

    handleFieldValueChange = (e, name, value) => {
      this.setFieldValue(name, value, () => {
        if(this.state.firstSaveAttempted) {
          this.clearErrors();
          const doc = this.assembleDocument();
          this.validateDoc(doc);
        }
      });
    }

    validateDoc = () => {
      let valid = true;
      const value = deepGet(this.state.fields, 'title.value');
      if(value === 'noland') {
        this.setFieldError('title', 'You cannot be Noland');
        valid = false;
      }

      return valid;
    }

    assembleDocument = () => {
      const doc = {};
      const { fields } = this.state;
      Object.keys(fields).forEach((name) => {
        doc[name] = fields[name].value;
      });
      return doc;
    }

    clearErrors = () => {
      const { fields } = this.state;
      Object.keys(fields).forEach((name) => {
        this.setFieldError(name, undefined);
      });
    }

    extractErrorsFromFields = () => {
      const errors = [];
      const { fields } = this.state;
      Object.keys(fields).forEach((name) => {
        const error = fields[name].error;
        if(error) errors.push(error);
      });
      return errors;
    }

    save = () => {
      this.setState({ firstSaveAttempted: true });
      this.clearErrors();

      const doc = this.assembleDocument();
      const isValid = this.validateDoc(doc);
      if(!isValid) {
        console.log('Validation failed');
        return;
      }

      this.mutate(doc);
    }

    handleMutationSuccess = (doc) => {
      console.log('Successfully save document: ', doc);
      queryManager.refetchQueries();
      if(this.props.onMutationSuccess) this.props.onMutationSuccess(doc);
    }

    handleMutationError = (error) => {
      console.error('Mutation Error: ', error);
      if(this.props.onMutationSuccess) this.props.onMutationError(error);
    }

    mutate = (doc) => {
      fetch('http://localhost:1337/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doc),
      })
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        }, (error) => {
          console.error('Network mutation error');
          this.handleMutationError(error);
        })
        .then((responseDoc) => {
          this.handleMutationSuccess(responseDoc);
        })
        .catch((error) => {
          console.error('Mutation error caught');
          this.handleMutationError(error);
        });
    }

    render() {
      const { ...rest } = this.props;
      const errors = this.extractErrorsFromFields();
      const fieldProps = {
        onChange: this.handleFieldValueChange,
        fields: this.state.fields,
      };

      return <WrappedComponent save={this.save} fieldProps={fieldProps} errors={errors} {...rest} />;
    }
  }
  withMutationClass.propTypes = {
    onMutationSuccess: PropTypes.func,
    onMutationError: PropTypes.func,
  };
  withMutationClass.defaultProps = {
    onMutationSuccess: null,
    onMutationError: null,
  };

  return withMutationClass;
};

export default withMutation;
