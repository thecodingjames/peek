import HistoryService from './history.service.js'
import HistoryModel from './history.model.js'

import ResponseModel from '../../http/response.model.js'

export default {

  data() {
    return {
      requests: HistoryService.requests,
      virtualizer: null,
      totalSize: 0,
      virtualRows: [],
    }
  },

  watch: {
    'requests.length'(count) {
      this.virtualizer.setOptions({
        ...this.virtualizer.options,
        count: this.requests.length
      })

      this.totalSize = this.virtualizer.getTotalSize()
      this.virtualRows = this.virtualizer.getVirtualItems()
    },
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
        debugger
        return this.$refs.scrollElement
      },
      estimateSize: () => 75,
      overscan: 5
    })

    this.totalSize = this.virtualizer.getTotalSize()
    this.virtualRows = this.virtualizer.getVirtualItems()
  },


  // TODO
  // https://tanstack.com/virtual/latest/docs/framework/vue/examples/fixed?path=examples%2Fvue%2Ffixed%2Fsrc%2Fcomponents%2FRowVirtualizerFixed.vue

  template: `
    <div>
      <p v-if="requests.length == 0" style="font-style: italic; padding-left: 1rem;">{{ t.drawers.history.empty }}</p>

      <div ref="scrollElement">
        <v-list v-else>

          {{ requests.length }}
          {{ totalSize }}
          {{ virtualRows }}

          <template v-for="(request, index) of requests">
            <v-list-item 
              link
              :appendIcon="alertIcon(request)"
              @click="handleItemClick(request)"
            >
              <v-list-item-title style="display: flex; gap: 0.5rem; align-items: baseline;">
                <span class="text-label-large">{{ request.method }}</span>
                <span>{{ request.path }}</span>
              </v-list-item-title>

              <v-list-item-title></v-list-item-title>

              <v-list-item-subtitle>{{ request.host }}</v-list-item-subtitle>

              <div 
                v-if="request.response"
                style="margin-top: 0.25rem; display: flex; gap: 1rem;"
              >
                <v-chip 
                  :append-icon="request.response.redirected ? 'mdi-chevron-double-right' : null"
                  :text="request.response.code"
                  :color="statusColor(request.response.code)"
                  label
                  variant="tonal"
                  size="small"
                  density="comfortable"
                />

                <v-chip 
                  :text="request.formattedDuration "
                  color="gray"
                  label
                  variant="tonal"
                  size="small"
                  density="comfortable"
                />
              </div>
            </v-list-item>

            <v-divider v-if="index != requests.length - 1"></v-divider>
          </template>

        </v-list>
      </div>
    </div>
  `
}
