import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ensureReady, After } from '@jaredpalmer/after';
import { ApolloProvider } from 'react-apollo';
import Helmet from 'react-helmet';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import './client.scss';
import routes from './routes';
import createApolloClient from './createApolloClient';

const client = createApolloClient({ ssrMode: false });

const muiTheme = createMuiTheme({
});

ensureReady(routes).then(data => hydrate(
  <ApolloProvider client={client}>

    <BrowserRouter>
      <MuiThemeProvider theme={muiTheme}>
        <After data={data} routes={routes} />
      </MuiThemeProvider>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'),
));
if (module.hot) {
  module.hot.accept();
}
