import startServer from './strazzle/index';

import routes from './routes';
import muiTheme from './styles/muiTheme';

startServer({ routes, muiTheme });
