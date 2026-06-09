import TabsService from '../../tabs/tabs.service.js'

import RequestModel from '../../http/request/request.model.js'

import HistoryModel from './history.model.js'

const KEY = 'history'

const loadedHistory = JSON.parse(localStorage.getItem(KEY) ?? '[]').map( item => {
  return new HistoryModel(item, item.response)
})

const requests = Vue.reactive(loadedHistory)

Vue.watch(
  requests,
  (value) => {
    localStorage.setItem(KEY, JSON.stringify(requests))
  }
)

export default {
  requests: Vue.readonly(requests),

  add(request, result) {
    requests.splice(0, 0, new HistoryModel(request, result))
  },

  openTab(historyModel) {
    TabsService.new(new RequestModel(historyModel))
  },
}
