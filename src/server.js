import React from 'react';
import express from 'express';
import { render } from '@jaredpalmer/after';
import { renderToString } from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import stringifySafe from 'json-stringify-safe';
import chalk from 'chalk';

import createApolloClient from './createApolloClient';
import Document from './Document';
import routes from './routes';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const client = createApolloClient({ ssrMode: true });

    const customRenderer = (node) => {
      const App = <ApolloProvider client={client}>{node}</ApolloProvider>;

      const gatherData = (error) => {
        const initialApolloState = client.extract();
        const html = renderToString(App);
        return { html, initialApolloState, error };
      };

      return getDataFromTree(App)
        .then(() => gatherData(null))
        .catch(error => gatherData(error));
    };

    try {
      const html = await render({
        req,
        res,
        routes,
        assets,
        customRenderer,
        document: Document,
      });
      res.send(html);
    } catch (error) {
      console.log(chalk.red('------------------------------ Error server rendering page ------------------------------'));
      console.log(stringifySafe(error, null, 2));
      console.log(chalk.red('-----------------------------------------------------------------------------------------'));
      res.send('Error server rendering page');
    }
  });

export default server;
