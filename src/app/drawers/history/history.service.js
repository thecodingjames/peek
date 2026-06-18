import db from '../../core/db.js'
import { STORE } from './history.db.js'
import { raw } from '../../core/helpers.js'

import TabsService from '../../tabs/tabs.service.js'

import RequestModel from '../../http/request/request.model.js'

import HistoryModel from './history.model.js'

const KEY = 'history'

let loadedHistory = (await db[STORE].getAll({ direction: 'prev' })).map( item => {
  return new HistoryModel(item, item.response)
})

const requests = Vue.reactive(loadedHistory)

export default {
  requests: Vue.readonly(requests),

  add(request, result) {
    const newHistory = new HistoryModel(request, result)
    requests.splice(0, 0, newHistory)

    db[STORE].put(raw(newHistory))
  },

  openTab(historyModel) {
    TabsService.new(new RequestModel(historyModel))
  },
}
