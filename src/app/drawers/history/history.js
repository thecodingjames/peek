import HistoryService from './history.service.js'
import HistoryModel from './history.model.js'

import ResponseModel from '../../http/response.model.js'

export default {

  data() {
    return {
    }
  },

  watch: {
    'requests.length'(count) {
      this.virtualizer.setOptions({
        ...this.virtualizer.options,
        count: this.requests.length
      })
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

  setup() {
    const scrollElement = Vue.ref()

    const requests = HistoryService.requests

    const virtualizer = VueVirtual.useVirtualizer({
      count: requests.length,
      getScrollElement: () => { 
        debugger
        return scrollElement.value
      },
      estimateSize: () => 75,
      overscan: 5
    })

    const virtualRows = Vue.computed(() =>
      virtualizer.value.getVirtualItems()
    )
     
    const totalSize = Vue.computed(() =>
      virtualizer.value.getTotalSize()
    )

    return {
      requests,
      scrollElement,
      virtualizer,
      virtualRows,
      totalSize,
    }
  },


  // TODO
  // https://tanstack.com/virtual/latest/docs/framework/vue/examples/fixed?path=examples%2Fvue%2Ffixed%2Fsrc%2Fcomponents%2FRowVirtualizerFixed.vue

  template: `
    <div>
      <p v-if="requests.length == 0" style="font-style: italic; padding-left: 1rem;">{{ t.drawers.history.empty }}</p>

      <div 
        v-else

        ref="scrollElement"
        style="height: 300px; overflow: auto; border: 1px solid blue;"
      >
        <v-list 
          :style="{ border: '1px solid red', height: totalSize+'px', width: '100%', position: 'relative' }"
        >
          {{ requests.length }}
          {{ totalSize }}

          <template 
            v-for="row in virtualRows"
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
          </template>

        </v-list>
      </div>
    </div>
  `
}
