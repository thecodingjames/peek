export const STORE = 'history'

export default {

  1(db) {
    if (!db.objectStoreNames.contains(STORE)) {
      db.createObjectStore(STORE, { autoIncrement: true });
    }
  },
}
