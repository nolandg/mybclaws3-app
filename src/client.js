import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ensureReady, After } from '@jaredpalmer/after';
import { ApolloProvider } from 'react-apollo';
import { MuiThemeProvider, createGenerateClassName } from '@material-ui/core/styles';
import createApolloClient from 'lapki/build/lib/boot/createApolloClient'; // eslint-disable-line import/no-extraneous-dependencies
import { SheetsRegistry } from 'react-jss/lib/jss';
import { JssProvider } from 'react-jss';

// import { startClientApp } from 'lapki'; // eslint-disable-line import/no-extraneous-dependencies

import './i18n/setYupLocale';
import muiTheme from './styles/muiTheme';
import routes from './routes';


// startClientApp({
//   muiTheme,
//   routes,
//   apolloClientOptions: {
//     uri: 'http://localhost:1337/graphql',
//   },
// });

// export default function startClientApp({ routes, muiTheme, apolloClientOptions }) {
const sheetsRegistry = new SheetsRegistry();
const sheetsManager = new WeakMap();
const generateClassName = createGenerateClassName();

const defaultApolloClientOptions = {
  ssrMode: false,
};
const client = createApolloClient({ ...defaultApolloClientOptions });

ensureReady(routes).then(data => hydrate(
  <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
    <MuiThemeProvider sheetsManager={sheetsManager} theme={muiTheme}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <After data={data} routes={routes} />
        </BrowserRouter>
      </ApolloProvider>
    </MuiThemeProvider>
  </JssProvider>,
  document.getElementById('root'),
));
// }

if (module.hot) {
  module.hot.accept();
}
