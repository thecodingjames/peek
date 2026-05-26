import Drawer from '../drawer.js'

import HistoryService from './history.service.js'

export default {
  components: {
    Drawer,
  },

  data() {
    return {
      requests: HistoryService.requests
    }
  },

  template: `
    <drawer :title="t.drawers.history.title">
      <p v-if="requests.length == 0" style="font-style: italic;">{{ t.drawers.history.empty }}</p>
    </drawer>
  `
}
