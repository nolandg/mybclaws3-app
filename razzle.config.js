const scssPlugin = require('./scss-plugin');

module.exports = {
  modify: scssPlugin,
};

module.exports = {
  modify: (...args) => {
    let [config, { target, dev }, webpack] = args;
    config = scssPlugin(...args);

    return config;
  },
};
