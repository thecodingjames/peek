export const STORE = 'tabs'

export default {

  1(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      const store = db.createObjectStore(STORE, { autoIncrement: true });

      store.createIndex('id', 'id', { unique: true });
    }
  },

}
