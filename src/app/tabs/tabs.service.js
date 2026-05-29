import t from '../translate/translate.service.js'

import SettingsService from '../drawers/settings/settings.service.js'

import RequestModel from '../http/request.model.js'

const KEY = 'tabs'

function Tab(id, title, request = new RequestModel()) {
  return {
    id,
    title,
    request,
  }
}

const defaultTab = Tab('default', t.tabs.defaultRequestName)

const loadedTabs = JSON.parse(localStorage.getItem(KEY) ?? '{}')
if (loadedTabs.tabs) {
  loadedTabs.tabs = loadedTabs.tabs.map( item => {
    return {
      ...item,
      request: new RequestModel(item.request),
    }
  })
} else {
  loadedTabs.tabs = [
    defaultTab,
  ]
}

// TODO !!! :(
let count = loadedTabs.tabs?.length ?? 0

const tabs = Vue.reactive(loadedTabs.tabs)
const current = Vue.ref(loadedTabs.current ?? defaultTab.id)

Vue.watch(
  () => [tabs, current.value],
  ([tabs, current]) => {
    localStorage.setItem(KEY, JSON.stringify({
      tabs,
      current
    }))
  },
  {
    deep: true,
  }
)

export default {
  current: Vue.readonly(current),

  tabs: Vue.readonly(tabs),

  new(request = new RequestModel()) {
    count = count + Number(tabs.length > 1 || count > 0)
    const id = crypto.randomUUID()

    let titleParts = [t.tabs.newRequest]

    if (count > 0) {
      titleParts.push(count)
    }

    tabs.unshift(Tab(id, titleParts.join(' '), request))
    current.value = id
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
