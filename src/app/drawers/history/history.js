import Drawer from '../drawer.js'

import HistoryService from './history.service.js'
import HistoryModel from './history.model.js'

import ResponseModel from '../../http/response.model.js'

export default {
  components: {
    Drawer,
  },

  data() {
    return {
      requests: HistoryService.requests
    }
  },

  methods: {
    
    statusColor(code) {
      return ResponseModel.statusColor(code)
    },

  },

  template: `
    <drawer class="_drawers_history_history" :title="t.drawers.history.title">
      <component is="style">
        ._drawers_history_history {
          h1 {
            margin: 0;
          }
        }
      </component>

      <p v-if="requests.length == 0" style="font-style: italic;">{{ t.drawers.history.empty }}</p>

      <v-list v-else>

        <v-list-item 
          v-for="request of requests"
          style="padding: 4px 0;"
        >
          <v-list-item-title style="display: flex; gap: 0.5rem; align-items: end;">
            <span class="text-label-large">{{ request.method }}</span>
            <v-chip 
              v-if="request.response"
              :append-icon="request.response.redirected ? 'mdi-chevron-double-right' : null"
              :text="request.response.code"
              :color="statusColor(request.response.code)"
              label
              variant="tonal"
              size="small"
              density="comfortable"
            />
          </v-list-item-title>
          <v-list-item-title>{{ request.path }}</v-list-item-title>
          <v-list-item-subtitle>{{ request.host }}</v-list-item-subtitle>
          <v-divider no-inset></v-divider>
        </v-list-item>

      </v-list>
    </drawer>
  `
}
