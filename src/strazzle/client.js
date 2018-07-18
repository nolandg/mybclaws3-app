import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ensureReady, After } from '@jaredpalmer/after';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import routes from '../routes';
import createApolloClient from './createApolloClient';

const client = createApolloClient({ ssrMode: false });

const theme = createMuiTheme({
  palette: {
    primary: { main: '#F00' },
  },
});

ensureReady(routes).then(data => hydrate(
  <MuiThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <After data={data} routes={routes} />
      </BrowserRouter>
    </ApolloProvider>
  </MuiThemeProvider>,
  document.getElementById('root'),
));
if (module.hot) {
  module.hot.accept();
}
