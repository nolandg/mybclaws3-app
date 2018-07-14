import { SheetsRegistry } from 'react-jss';
import { createGenerateClassName } from '@material-ui/core/styles';

console.log('creating styles...');

export const sheets = new SheetsRegistry();
export const generateClassName = createGenerateClassName();
