import * as React from 'react';
import { AfterRoot, AfterData } from '@jaredpalmer/after';
import qatch from 'await-to-js';
import PropTypes from 'prop-types';

import ErrorPage from './ErrorPage';

export default class Document extends React.Component {
  static async getInitialProps({ assets, data, renderPage }) {
    const [error, page] = await qatch(renderPage());
    return { assets, data, error, ...page };
  }

  render() {
    const { helmet, assets, data, initialApolloState, error } = this.props;

    // if(error) {
    //   return <ErrorPage error={error} assets={assets} />;
    // }

    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();
    return (
      <html {...htmlAttrs}>
        <head>
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
        </head>
        <body {...bodyAttrs}>
          <AfterRoot />
          <AfterData data={data} />
          <script dangerouslySetInnerHTML={{ __html: `window.__APOLLO_STATE__=${JSON.stringify(initialApolloState).replace(/</g, '\\u003c')};` }} />
          <script
            type="text/javascript"
            src={assets.client.js}
            defer
            crossOrigin="anonymous"
          />
        </body>
      </html>
    );
  }
}

Document.propTypes = {
  helmet: PropTypes.object.isRequired,
  assets: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  initialApolloState: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
};
