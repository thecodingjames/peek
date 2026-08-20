import HistoryService from './history.service.js'
import HistoryModel from './history.model.js'

import ResponseModel from '../../http/response.model.js'

export default {

  data() {
    return {
      requests: HistoryService.requests,
      virtualizer: null,
      scrollHeight: 0,
    }
  },

  methods: {
    
    statusColor(code) {
      return ResponseModel.statusColor(code)
    },

    alertIcon(request) {
      if (!request?.response) {
        return Vue.h(Vuetify.components.VIcon, {
          icon: 'mdi-alert',
          color: 'red',
          size: 'x-small',
        })
      }
    },

    handleItemClick(request) {
      HistoryService.openTab(request)
    }

  },

  mounted() {

    this.virtualizer = VueVirtual.useVirtualizer({
      count: this.requests.length,
      getScrollElement: () => { 
        return this.$refs.scrollElement
      },
      estimateSize: () => 75,
      overscan: 5
    })

    this.scrollHeight = this.$refs.scrollElement.closest('#_history_root').parentElement.getBoundingClientRect().height

  },


  template: `
    <div id="_history_root">
      <p v-if="requests.length == 0" style="font-style: italic; padding-left: 1rem;">{{ t.drawers.history.empty }}</p>

      <div 
        v-else

        ref="scrollElement"
        style="overflow: auto;"
        :style="{ height: scrollHeight+'px' }"
      >
        <v-list 
          :style="{ height: virtualizer?.getTotalSize()+'px', width: '100%', position: 'relative' }"
        >

          <div 
            v-for="row in virtualizer?.getVirtualItems()"
            :key="row.index"
            :style="{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: row.size+'px',
              transform: 'translateY('+row.start+'px)',
            }"
          >
            <v-list-item 
              link
              :appendIcon="alertIcon(requests[row.index])"
              @click="handleItemClick(requests[row.index])"
            >
              <v-list-item-title style="display: flex; gap: 0.5rem; align-items: baseline;">
                <span class="text-label-large">{{ requests[row.index].method }}</span>
                <span>{{ requests[row.index].path }}</span>
              </v-list-item-title>

              <v-list-item-title></v-list-item-title>

              <v-list-item-subtitle>{{ requests[row.index].host }}</v-list-item-subtitle>

              <div 
                v-if="requests[row.index].response"
                style="margin-top: 0.25rem; display: flex; gap: 1rem;"
              >
                <v-chip 
                  :append-icon="requests[row.index].response.redirected ? 'mdi-chevron-double-right' : null"
                  :text="requests[row.index].response.code"
                  :color="statusColor(requests[row.index].response.code)"
                  label
                  variant="tonal"
                  size="small"
                  density="comfortable"
                />

                <v-chip 
                  :text="requests[row.index].formattedDuration "
                  color="gray"
                  label
                  variant="tonal"
                  size="small"
                  density="comfortable"
                />
              </div>
            </v-list-item>

            <v-divider v-if="row.index != requests.length - 1"></v-divider>
          </div>

        </v-list>
      </div>
    </div>
  `
}
