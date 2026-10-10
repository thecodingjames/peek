import db from '../db/db.js'
import { STORE } from './tabs.db.js'

import { raw } from '../core/helpers.js'
import t from '../translate/translate.service.js'

import SettingsService from '../drawers/settings/settings.service.js'

import RequestModel from '../http/request/request.model.js'

const KEY = 'currentTab'

const tabWatchers = new Map()

function CreateTab(id, title, request = new RequestModel()) {
  const tab = Vue.reactive({
    id,
    title,
    request,
  })

  tabWatchers.set(id, Vue.watch(
    tab,
    (value) => {
      const data = raw(value)

      db[STORE].update('id', IDBKeyRange.only(value.id), data).catch( result => {
       db[STORE].put(data)
      })
    },
    {
      immediate: true,
    }
  ))

  return tab
}

const loadedCurrentTab = localStorage.getItem(KEY)
let loadedTabs = await (async () => {
  const loaded = (await db[STORE].getAll({ direction: 'prev' })).map( item => {
    return CreateTab(
      item.id,
      item.title,
      new RequestModel(item.request)
    )
  })

  if (loaded.length > 0) {
    return loaded
  } else {
    return [
      CreateTab('default', t.tabs.defaultRequestName)
    ]
  }
})()

let count = 0 // TODO computed dynamically according to existing data?

const currentTabs = Vue.reactive(loadedTabs)
const currentTab = Vue.ref(loadedCurrentTab ?? loadedTabs[0].id)

Vue.watch(
  currentTab,
  (newCurrent) => {
    localStorage.setItem(KEY, newCurrent)
  },
  {
    immediate: true,
  }
)

export default {
  current: Vue.readonly(currentTab),

  tabs: Vue.readonly(currentTabs),

  new(request = new RequestModel()) {
    const tabNumber = (this.tabs.length > 1 || count > 0) ? count : 0
    count++

    let titleParts = [t.tabs.newRequest]
    if (tabNumber > 0) {
      titleParts.push(tabNumber)
    }

    const id = crypto.randomUUID()
    const newTab = CreateTab(id, titleParts.join(' '), request)

    currentTabs.unshift(newTab)

    Vue.nextTick(() => {
      // weird concurrency???
      currentTab.value = id
    })
  },

  get(id) {
    return currentTabs.find( t => t.id == id )
  },

  select(id) {
    if (id) {
      currentTab.value = id
    }
  },

  rename(id, title) {
    const tab = this.get(id)

    tab.title = title.trim()
  },

  clear(id) {
    const tab = this.get(id)
    tab.request.clear()
  },

  remove(id) {
    if (this.tabs.length == 1) {
      return
    }

    const index = this.tabs.findIndex( t => t.id == id )
    currentTabs.splice(index, 1)

    if (id == currentTab.value) {
      const substituteIndex = Math.min(Math.max(index, 0), this.tabs.length - 1)
      currentTab.value = this.tabs[substituteIndex].id
    }

    db[STORE].delete('id', IDBKeyRange.only(id))

    tabWatchers.get(id)() // run clean up function
    tabWatchers.delete(id)
  },

  duplicate(id) {
    const duplicated = this.get(id)

    this.new(duplicated.request.clone())
  },

  removeOthers(id) {
    
    (async () => {
      (await db[STORE].writer('id')).openCursor().onsuccess = (event) => {
        const cursor = event.target.result;

        if (cursor) {
          if (cursor.value.id != id) {
            cursor.delete()
          }

          cursor.continue()
        }
      }
    })()

    count = 0

    const keptTab = this.get(id)
    currentTabs.splice(0, this.tabs.length, keptTab)

    currentTab.value = id
  },

  removeAll() {
    tabWatchers.forEach( (cleanUp) => cleanUp() )
    tabWatchers.clear()
    
    db[STORE].clear()

    count = 0
    currentTabs.splice(0, this.tabs.length)

    this.new() 
  },

  step(direction) {
    const currentIndex = this.tabs.findIndex( t => t.id == currentTab.value )
    const length = this.tabs.length
    const destinationIndex = Math.max(currentIndex + direction, 0) % length

    currentTab.value = this.tabs[destinationIndex].id
  },

  goNext() {
    this.step(1)
  },

  goPrevious() {
    this.step(-1)
  },
}
