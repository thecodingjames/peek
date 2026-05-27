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
    <div style="overflow-y: scroll; height: 100%;">
      <drawer class="_drawers_history_history" :title="t.drawers.history.title">
        <component is="style">
          ._drawers_history_history {
            padding-bottom: 0 !important;

            h1 {
              margin: 0;
            }
          }
        </component>

        <p v-if="requests.length == 0" style="font-style: italic;">{{ t.drawers.history.empty }}</p>
      </drawer>

      <v-list v-if="requests.length > 0">

        <template v-for="(request, index) of requests">
          <v-list-item link>
            <v-list-item-title style="display: flex; gap: 0.5rem; align-items: baseline;">
              <span class="text-label-large">{{ request.method }}</span>
              <span>{{ request.path }}</span>
            </v-list-item-title>

            <v-list-item-title></v-list-item-title>

            <v-list-item-subtitle>{{ request.host }}</v-list-item-subtitle>

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
          </v-list-item>

          <v-divider v-if="index != requests.length - 1"></v-divider>
        </template>

      </v-list>
    </div>
  `
}
