import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ensureReady, After } from '@jaredpalmer/after';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider } from '@material-ui/core/styles';

import createApolloClient from './createApolloClient';

function createClient({ routes, muiTheme }) {
  const sheetsManager = new WeakMap();
  const client = createApolloClient({ ssrMode: false });

  ensureReady(routes).then(data => hydrate(
    <MuiThemeProvider sheetsManager={sheetsManager} theme={muiTheme}>
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
}

export { createClient };
