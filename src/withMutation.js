import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import deepGet from 'lodash.get';
import deepSet from 'lodash.set';
import { queryManager } from 'lapki'; // eslint-disable-line import/no-extraneous-dependencies

import connectionManager from './graphqlConnectionManager';

export default function (documentType, document) {
  return function withMutation(WrappedComponent) {
    class withMutationClass extends Component {
      constructor(props) {
        super(props);
        this.state = {
          fields: this.initializeFields(),
          firstSaveAttempted: false,
        };
      }

      isNew = () => {
        if(document && (document.id || document._id)) return false;
        return true;
      }

      getFields = () => {
        const fields = [];
        Object.keys(this.state.fields).forEach((name) => {
          const field = this.state.fields[name];
          fields.push(field);
        });
        return fields;
      }

      getTouchedFields = () => {
        const fields = [];
        Object.keys(this.state.fields).forEach((name) => {
          const field = this.state.fields[name];
          if(!field.touched) return;
          fields.push(field);
        });
        return fields;
      }

      // Example field:
      //   {
      //     name: 'title',
      //     value: 'My Title',
      //     error: 'Too short',
      //     touched: 'true',
      //   }
      initializeFields = () => {
        const fields = {};
        if(typeof document !== 'object') return fields;

        Object.keys(document).forEach((name) => {
          fields[name] = {
            name,
            touched: false,
            error: null,
            value: document[name],
          };
        });

        return fields;
      }

      componentDidMount = () => {
        this.setState({ firstSaveAttempted: false });
      }

      setFieldValue = (name, value, cb) => {
        this.setState((state) => {
          deepSet(state.fields, `${name}.value`, value);
          deepSet(state.fields, `${name}.name`, name);
          return state;
        }, cb);
      }

      setFieldError = (name, error, cb) => {
        this.setState((state) => {
          deepSet(state.fields, `${name}.error`, error);
          deepSet(state.fields, `${name}.name`, name);
          return state;
        }, cb);
      }

      markFieldAsTouched = (name, cb) => {
        this.setState((state) => {
          deepSet(state.fields, `${name}.touched`, true);
          return state;
        }, cb);
      }

      handleFieldValueChange = (e, name, value) => {
        this.setFieldValue(name, value, () => {
          if(this.state.firstSaveAttempted) this.recheckForErrors();
        });
        this.markFieldAsTouched(name);
      }

      recheckForErrors = () => {
        this.clearErrors();
        const doc = this.assembleDocument();
        this.validateDoc(doc);
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
        this.getTouchedFields().forEach((field) => {
          doc[field.name] = field.value;
        });

        // Always include id or _id fields if they exist even if they haven't been touched
        if(this.state.fields.id) doc.id = this.state.fields.id.value;
        if(this.state.fields._id) doc._id = this.state.fields._id.value;

        return doc;
      }

      clearErrors = () => {
        this.getTouchedFields().forEach((field) => {
          this.setFieldError(field.name, null);
        });
      }

      extractErrorsFromFields = () => {
        const errors = [];
        this.getTouchedFields().forEach((field) => {
          if(field.error) errors.push(field.error);
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

        this.mutate(doc, 'save');
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

      mutate = (doc, operation) => {
        const connection = connectionManager.getDefault();
        const isNew = this.isNew();
        let verb;
        let uri = `${connection.uri}/${documentType}`;

        if(isNew && (operation === 'save')) {
          verb = 'POST';
        }else if(!isNew) {
          if(operation === 'save') {
            verb = 'PUT';
          }else if(operation === 'delete') {
            verb = 'DELETE';
          }else{
            throw new Error(`Invalid combination of operation and newness to mutate(). Cannot "${operation}" on existing document`);
          }
          if(doc._id) uri += `/${doc._id}`;
          else if(doc.id) uri += `/${doc.id}`;
          else throw new Error('Mising id or _id field for non-new mutation');
        }else{
          throw new Error(`Invalid combination of operation and newness to mutate(). Cannot "${operation}" on new document`);
        }

        const headers = {
          'Content-Type': 'application/json',
          ...connection.headers,
        };
        fetch(uri, {
          method: verb,
          headers,
          body: doc ? JSON.stringify(doc) : '',
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

        return <WrappedComponent save={this.save} fieldProps={fieldProps} errors={errors} document={document} {...rest} />;
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
}
