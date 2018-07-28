import { setLocale as setYupLocale } from 'yup/lib/customLocale';

setYupLocale({
  mixed: {
    notType: ({ label, type }) => `${label} must be a ${type}`,
  },
  number: {
    integer: ({ label }) => `${label} must be a whole number integer. Decimals or fracions are not allowed.`,
  },
});
