

import { startClientApp } from 'lapki'; // eslint-disable-line

import './i18n/setYupLocale';
import muiTheme from './styles/muiTheme';
import routes from './routes';


startClientApp({
  muiTheme,
  routes,
  apolloClientOptions: {
    uri: 'http://localhost:1337/graphql',
  },
});

if (module.hot) {
  module.hot.accept();
}
