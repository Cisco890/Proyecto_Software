let store = {};

const mockAsyncStorage = {
  setItem: async (key, value) => {
    store[key] = value;
    return Promise.resolve();
  },
  getItem: async (key) => {
    return Promise.resolve(store[key] || null);
  },
  removeItem: async (key) => {
    delete store[key];
    return Promise.resolve();
  },
  clear: async () => {
    store = {};
    return Promise.resolve();
  },
};

export default mockAsyncStorage;
