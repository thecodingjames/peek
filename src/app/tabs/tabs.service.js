import db from '../core/db.js'
import { STORE } from './tabs.db.js'

import { raw } from '../core/helpers.js'
import t from '../translate/translate.service.js'

import SettingsService from '../drawers/settings/settings.service.js'

import RequestModel from '../http/request/request.model.js'

const KEY = 'currentTab'

const tabWatchers = new Map()

function Tab(id, title, request = new RequestModel()) {
  const newTab = Vue.reactive({
    id,
    title,
    request,
  })

  tabWatchers.set(id, Vue.watch(
    newTab,
    (value) => {
      db[STORE].writer('id').then( index => {
        index.openCursor(IDBKeyRange.only(value.id)).onsuccess = (cursor) => {
          event.target.result.update(raw(value))
        }
      })
    }
  ))

  return newTab
}

const defaultTab = Tab('default', t.tabs.defaultRequestName)

const loadedCurrentTab = localStorage.getItem(KEY)
let loadedTabs = await (async () => {
  const loaded = (await db[STORE].getAll({ direction: 'prev' })).map( item => {
    return Tab(
      item.id,
      item.title,
      new RequestModel(item.request)
    )
  })

  if (loaded.length > 0) {
    return loaded
  } else {
    return [
      defaultTab,
    ]
  }
})()

let count = 0 // TODO computed dynamically according to existing data?

const tabs = Vue.reactive(loadedTabs)
const current = Vue.ref(loadedCurrentTab ?? defaultTab.id)

Vue.watch(
  current,
  (newCurrent) => {
    localStorage.setItem(KEY, newCurrent)
  }
)

export default {
  current: Vue.readonly(current),

  tabs: Vue.readonly(tabs),

  new(request = new RequestModel()) {
    const tabNumber = (tabs.length > 1 || count > 0) ? count : 0
    count++

    let titleParts = [t.tabs.newRequest]
    if (tabNumber > 0) {
      titleParts.push(tabNumber)
    }

    const id = crypto.randomUUID()
    const newTab = Tab(id, titleParts.join(' '), request)

    tabs.unshift(newTab)
    current.value = id

    db[STORE].put(raw(newTab))
  },

  get(id) {
    return tabs.find( t => t.id == id )
  },

  select(id) {
    if (id) {
      current.value = id
    }
  },

  rename(id, title) {
    const tab = this.get(id)
    tab.title = title
  },

  remove(id) {
    if (tabs.length == 1) {
      return
    }

    const index = tabs.findIndex( t => t.id == id )
    tabs.splice(index, 1)

    if (id == current.value) {
      const substituteIndex = Math.min(Math.max(index, 0), tabs.length - 1)
      current.value = tabs[substituteIndex].id
    }

    db[STORE].writer('id').then( index => {
      index.openCursor(IDBKeyRange.only(id)).onsuccess = (cursor) => {
        event.target.result.delete()
      }
    })

    tabWatchers.get(id)()
    tabWatchers.delete(id)
  },

  step(direction) {
    const currentIndex = tabs.findIndex( t => t.id == current.value )
    const length = tabs.length
    const destinationIndex = Math.max(currentIndex + direction, 0) % length

    current.value = tabs[destinationIndex].id
  },

  goNext() {
    this.step(1)
  },

  goPrevious() {
    this.step(-1)
  },
}
