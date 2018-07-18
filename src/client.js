import { createClient } from './strazzle/client';

import routes from './routes';
import muiTheme from './styles/muiTheme';

createClient({
  muiTheme,
  routes,
});
