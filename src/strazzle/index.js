import http from 'http';
import createServerApp from './server';

function startServer({ routes, muiTheme }) {
  const app = createServerApp({ routes, muiTheme });
  const server = http.createServer(app);

  let currentApp = app;

  server.listen(process.env.PORT || 3000, (error) => {
    if (error) {
      console.log(error);
    }

    console.log('🚀 started');
  });

  if (module.hot) {
    console.log('✅  Server-side HMR Enabled!');

    module.hot.accept('./server', () => {
      console.log('🔁  HMR Reloading `./server`...');
      server.removeListener('request', currentApp);
      const newApp = require('./server').default;
      server.on('request', newApp);
      currentApp = newApp;
    });
  }

  return server;
}

export default startServer;
