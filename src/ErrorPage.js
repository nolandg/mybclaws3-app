import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stringifySafe from 'json-stringify-safe';

class ErrorPage extends Component {
  componentDidMount() {
    const { error } = this.props;
    console.error(error);
  }

  render() {
    const { error } = this.props;
    const errorStr = stringifySafe(error, null, 4).replace(/\n/g, '<br />');

    const bodyStyle = { fontFamily: 'sans-serif', margin: '20px' };
    const titleStyle = { color: '#800' };
    const preStyle = { };

    return (
      <html>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>Error</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="theme-color" content="#000000" />
        </head>
        <body style={bodyStyle}>
          <div className="error-page">
            <h1 style={titleStyle}>Error</h1>
            <pre dangerouslySetInnerHTML={{ __html: errorStr }} style={preStyle} />
          </div>
        </body>
      </html>
    );
  }
}

ErrorPage.propTypes = {
  error: PropTypes.object.isRequired,
};

export default ErrorPage;
