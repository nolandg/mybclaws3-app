/* eslint-disable no-shadow */
import * as React from 'react';
import { AfterRoot, AfterData } from '@jaredpalmer/after';
import qatch from 'await-to-js';
import PropTypes from 'prop-types';
import { JssProvider, SheetsRegistry } from 'react-jss';
import { createGenerateClassName } from '@material-ui/core/styles';

const sheets = new SheetsRegistry();
const generateClassName = createGenerateClassName();

export default class Document extends React.Component {
  static async getInitialProps({ assets, data, renderPage }) {
    const [error, page] = await qatch(renderPage(After => props => (
      <JssProvider registry={sheets} generateClassName={generateClassName}>
        <After {...props} />
      </JssProvider>
    )));

    if(error) {
      // ToDo: decide if error is fatal
      const fatal = true;
      if(fatal) {
        throw error;
      }
    }
    return { assets, data, error, sheets, ...page };
  }

  render() {
    const { helmet, assets, data, initialApolloState, sheets } = this.props;

    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();
    return (
      <html {...htmlAttrs}>
        <head>
          <meta name="Made With Love By: " content="Noland" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <title>After with Apollo !</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="theme-color" content="#000000" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {assets.client.css && (
            <link rel="stylesheet" href={assets.client.css} />
          )}
          <style type="text/css">{sheets.toString()}</style>
        </head>
        <body {...bodyAttrs}>
          <AfterRoot />
          <AfterData data={data} />
          <script dangerouslySetInnerHTML={{ __html: `window.__APOLLO_STATE__=${JSON.stringify(initialApolloState).replace(/</g, '\\u003c')};` }} />
          <script type="text/javascript" src={assets.client.js} defer crossOrigin="anonymous" />
        </body>
      </html>
    );
  }
}

Document.propTypes = {
  helmet: PropTypes.object.isRequired,
  assets: PropTypes.object.isRequired,
  data: PropTypes.object,
  initialApolloState: PropTypes.object.isRequired,
  error: PropTypes.object,
  sheets: PropTypes.any.isRequired,
};
Document.defaultProps = {
  data: null,
  error: null,
};
