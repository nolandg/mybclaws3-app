import express from 'express';
import { configureServerApp } from 'strazzle';
import routes from './routes';
import muiTheme from './styles/muiTheme';

const server = express();

configureServerApp(server, {
  muiTheme,
  routes,
  razzlePublicDir: process.env.RAZZLE_PUBLIC_DIR,
  razzleAssetsManifestPath: process.env.RAZZLE_ASSETS_MANIFEST,
});

server.disable('x-powered-by');

export default server;
