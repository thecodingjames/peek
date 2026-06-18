import tabs from '../tabs/tabs.db.js'
import history from '../drawers/history/history.db.js'

const tables = {
  tabs,
  history,
}

class DB {

  #db = null
  #connection = null

  get version() {
    return Object.values(tables).reduce( (sum, migrations) => {
      const versions = Object.keys(migrations)

      return sum + Math.max(...versions)
    }, 0)
  }

  get db() {
    return ( async () => {
      if (this.#db) {
        return this.#db
      } else {
        return await this.#connection
      }
    })()
  }

  constructor(tables) {
    this.tables = tables

    this.#connection = new Promise( (resolve, reject) => {
      const request = indexedDB.open('peek', this.version)

      request.onerror = (event) => {
        reject(event)
      };

      request.onsuccess = (event) => {
        this.#db = event.target.result;

        this.#db.onerror = (event) => {
          console.error('Database operation failed', event)
        }

        resolve(this.#db)
      };

      request.onupgradeneeded = (event) => { 
        this.migrate(event.target.result)
      }
    })

    return new Proxy(this, {

      get: (target, prop) => {
        if (Object.keys(this.tables).includes(prop)) {
          return target.table(prop)
        }

        return Reflect.get(...arguments)
      },

    })
  }

  migrate(db) {
    Object.values(this.tables).forEach( migrations => {
      const ordered = Object.keys(migrations).sort()

      ordered.forEach( version => {
        migrations[version](db)
      })
    })
  }

  table(store) {
    const thisDb = this.db
    const thisStore = store

    return {
      async runner(mode, key = null) {
        const objectStore = (await thisDb).transaction([thisStore], mode).objectStore(thisStore)

        if (key) {
          return objectStore.index(key)
        } else {
          return objectStore
        }
      },

      reader(key = null) {
        return this.runner('readonly', key)
      },

      writer(key = null) {
        return this.runner('readwrite', key)
      },

      getAll(options = {}) {
        return new Promise( async (resolve, reject) => {
          const request = (await this.reader()).getAll(options)

          request.onsuccess = (event) => {
            resolve(event.target.result)  
          }

          request.onerror = (event) => {
            resolve(event)
          }
        })
      },

      put(data) {
        return new Promise( async (resolve, reject) => {
          const request = (await this.writer()).put(data)

          request.onsuccess = (event) => {
            resolve(event.target.result)  
          }

          request.onerror = (event) => {
            resolve(event)
          }
        })
      },

      delete(key) {
        return new Promise( async (resolve, reject) => {
          const request = (await this.writer()).delete(key)

          request.onsuccess = (event) => {
            resolve(event.target.result)  
          }

          request.onerror = (event) => {
            resolve(event)
          }
        })
      },

    }
  }

}

const db = new DB(tables)
export default db
