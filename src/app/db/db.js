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

    const toPromise = (request) => {
      return new Promise( async (resolve, reject) => {
        try {
          const r = await request()

          r.onsuccess = (event) => {
            resolve(event.target.result)  
          }

          r.onerror = (event) => {
            reject(event)
          }
        } catch (err) {
          reject(err)
        }
      })
    }

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
        return toPromise( async ()=> (await this.reader()).getAll(options) )

      },

      put(data) {
        return toPromise( async ()=> (await this.writer()).put(data) )
      },

      async update(key, range, data) {
        const cursor = await toPromise( async ()=> {
          return (await this.writer(key)).openCursor(range)
        })

        // TODO might want to handle range return multiple values
        // map data to array then Promise.all ?
        return toPromise( async ()=> cursor.update(data) )
      },

      async delete(key, range) {
        const cursor = await toPromise( async ()=> {
          return (await this.writer(key)).openCursor(range)
        })

        // TODO might want to handle range return multiple values
        // map data to array then Promise.all ?
        return toPromise( async ()=> cursor.delete() )
      },

    }
  }

}

const db = new DB(tables)
export default db
