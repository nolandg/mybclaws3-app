import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ensureReady, After } from '@jaredpalmer/after';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { JssProvider } from 'react-jss';

import './client.scss';
import routes from './routes';
import createApolloClient from './createApolloClient';
import { generateClassName, sheets } from './stylesProvider';

const client = createApolloClient({ ssrMode: false });

const muiTheme = createMuiTheme({
});

ensureReady(routes).then(data => hydrate(
  <JssProvider registry={sheets} generateClassName={generateClassName}>
    <MuiThemeProvider theme={muiTheme}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <After data={data} routes={routes} />
        </BrowserRouter>
      </ApolloProvider>
    </MuiThemeProvider>
  </JssProvider>,
  document.getElementById('root'),
));
if (module.hot) {
  module.hot.accept();
}
