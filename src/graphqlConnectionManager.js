class ConnectionManager {
  constructor() {
    this.connections = {
      default: {
        uri: 'http://localhost:1337',
        headers: {},
      },
    };
  }

  get = name => this.connections[name]

  getDefault = () => this.connections.default;

  configure = (name, config) => {
    const existingConfig = this.connections[name] || {};
    const mergedConfig = { ...this.connections.default, ...existingConfig, ...config };
    this.connections[name] = mergedConfig;
  }
}

const instance = new ConnectionManager();
Object.freeze(instance);

export default instance;