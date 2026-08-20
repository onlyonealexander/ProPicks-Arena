// Stands in for the window.storage API that only exists inside Claude's
// artifact viewer. Backed by the browser's real localStorage, so the app
// behaves the same way when run locally in VS Code.

function nsKey(key, shared) {
  return `${shared ? "shared" : "personal"}::${key}`;
}

window.storage = {
  async get(key, shared = false) {
    const k = nsKey(key, shared);
    if (!(k in localStorage)) {
      throw new Error(`Key not found: ${key}`);
    }
    return { key, value: localStorage.getItem(k), shared };
  },

  async set(key, value, shared = false) {
    const k = nsKey(key, shared);
    localStorage.setItem(k, value);
    return { key, value, shared };
  },

  async delete(key, shared = false) {
    const k = nsKey(key, shared);
    const existed = k in localStorage;
    localStorage.removeItem(k);
    return { key, deleted: existed, shared };
  },

  async list(prefix = "", shared = false) {
    const ns = shared ? "shared::" : "personal::";
    const fullPrefix = ns + prefix;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(fullPrefix)) keys.push(k.slice(ns.length));
    }
    return { keys, prefix, shared };
  },
};
