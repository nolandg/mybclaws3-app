import { serverApp } from 'lapki'; // eslint-disable-line import/no-extraneous-dependencies
import routes from './routes';
import muiTheme from './styles/muiTheme';

const server = serverApp.create({
  muiTheme,
  routes,
  apolloClientOptions: {
    uri: 'http://localhost:1337/graphql',
  },
  appHeaders: {
    'Made-With-Love-By': 'Noland Germain and Nook espresso',
  },
  razzlePublicDir: process.env.RAZZLE_PUBLIC_DIR,
  razzleAssetsManifestPath: process.env.RAZZLE_ASSETS_MANIFEST,
});

export default server;
