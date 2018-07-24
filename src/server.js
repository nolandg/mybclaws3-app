import { serverApp } from 'lapki'; // eslint-disable-line
import routes from './routes';
import muiTheme from './styles/muiTheme';

const server = serverApp.create({
  muiTheme,
  routes,
  apolloClientOptions: {
    uri: 'http://localhost:1337/graphql',
  },
  appHeaders: {
    'Made-With-Love-and-Espresso-By': 'Noland Germain',
  },
  razzlePublicDir: process.env.RAZZLE_PUBLIC_DIR,
  razzleAssetsManifestPath: process.env.RAZZLE_ASSETS_MANIFEST,
});

export default server;
