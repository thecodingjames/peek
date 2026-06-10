import Title from './title.js'
import EditableKeyValue from './editable-key-value.js'
import Body from './body.js'

export default {

  components: {
    DetailTitle: Title,
  },

  props: [
    'request',
  ],

  data() {
    return {
      detailsTab: null,
      detailsPanels: [],
    }
  },

  computed: {

    details() {
      return [
        {
          name: 'query',
          component: () => Vue.h(EditableKeyValue, {
            items: this.request.query,
            'onSort': (oldIndex, newIndex) => {
              this.request.sortQuery(oldIndex, newIndex)
            },
            'onEdit': () => {
              this.request.applyQuery()
            },
            'onDelete': (id) => {
              this.request.removeQuery(id)
            }
          }),

          count: Vue.computed( () => this.request.queryModel.actives.length ),

          handleCreate: (handleDetail) => {
            this.request.addQuery()
            handleDetail()
          },
        },

        /*
        body: {
          component: () => Vue.h(Body, {
          }),

          modes: ['raw', 'form'],
          mode: Vue.ref('raw'),
          create: (detail) => detail.mode.value == 'form',

          count: () => undefined,

          handleCreate: (handleDetail) => {
            console.log('body create')
            handleDetail()
          },

        },

        */
        {
          name: 'headers',
          component: () => Vue.h(EditableKeyValue, {
            items: this.request.headers,
            'onSort': (oldIndex, newIndex) => {
              this.request.sortHeaders(oldIndex, newIndex)
            },
            'onDelete': (id) => {
              this.request.removeHeader(id)
            }
          }),

          count: Vue.computed( () => this.request.headersModel.actives.length ),

          handleCreate: (handleDetail) => {
            this.request.addHeader()

            handleDetail()
          },
        }
      ]
    },

    openedTab() {
      return this.detailsTab ?? this.detailsPanels.at(-1)
    },

    openedPanels() {
      let panels = [ ...this.detailsPanels ]

      if (!panels.includes(this.detailsTab)) {
        panels.push(this.detailsTab)
      }

      return panels.filter( p => p )
    },


  },

  methods: {

    handleTabClick(tab) {
      if (this.openedTab == tab) {
        this.detailsTab = null
        this.detailsPanels = this.detailsPanels.filter( p => p != tab )
      } else {
        this.detailsTab = tab
      }
    },

    handlePanelClick(panels) {
      this.detailsPanels = panels
    },

    handleDetailTab(tab) {
      this.detailsTab = tab
    },

    handleDetailPanel(panel) {
      if(!this.detailsPanels.includes(panel)) {
        this.detailsPanels.push(panel)
      }
    },

  },

  watch: {

    detailsPanels(panels) {
      const deleted = this.openedPanels.filter( i => !panels.includes(i) )[0]
      const added = panels.filter( i => !this.openedPanels.includes(i) )[0]

      const notOpened = !this.openedPanels.includes(added)

      if (added && notOpened) {
        this.detailsTab = added
      } else if (this.detailsTab && this.detailsTab == deleted) {
        this.detailsTab = panels.at(-1)
      }
    },

  },

  template: `
    <div class="_http_request_details">
      <component is="style">
        ._http_request_details {
            --opacity: calc(var(--v-activated-opacity) * var(--v-high-emphasis-opacity));
            --bg: color-mix(in srgb, currentColor calc(var(--opacity) * 100%), transparent);

          .v-tabs {
            background-color: var(--bg);
          }

          .horizontal-tabs {
            display: block;
          }

          .vertical-panels {
            display: none;
          }

          .v-expansion-panel-text__wrapper {
            padding: 0;
          }

          @media (min-width: 960px) {
            .horizontal-tabs {
              DDDdisplay: none;
            }

            .vertical-panels {
              display: block;
            }
          }
        }
      </component>

      <div class="horizontal-tabs">
        <v-tabs
          :model-value="openedTab"
          :class="{ rounded: !openedTab, 'rounded-t': openedTab }"
          density="compact"
          grow
        >
          <v-tab
            v-for="detail of details"

            :value="detail.name"

            @click="handleTabClick(detail.name)"
            :selected-class="openedTab ? 'v-tab--selected' : ''"
          >
            <detail-title
              :detail
              :visible="openedTab == detail.name"

              v-model:mode="detail.mode"
              @update:mode="handleDetailTab(detail.name)"

              @create="detail.handleCreate(() => handleDetailTab(detail.name))"
            />
          </v-tab>
        </v-tabs>

        <v-expand-transition>
          <v-tabs-window
            v-if="openedTab"
            :model-value="openedTab"
          >
            <v-tabs-window-item
              v-for="detail of details"
              :value="detail.name"
              class="rounded-b"
            >
              <component :is="detail.component"></component>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-expand-transition>
      </div>

      <v-expansion-panels
        multiple
        variant="accordion"
        static
        elevation="0"
        class="vertical-panels"

        :model-value="openedPanels"
        @update:modelValue="handlePanelClick"
      >
        <v-expansion-panel
          v-for="detail of details"
          :value="detail.name"
        >
          <v-expansion-panel-title 
            style="background-color: var(--bg); min-height: 2.5rem; padding-top: 0; padding-bottom: 0;"
            density="compact"
          >
            <detail-title
              :detail
              :visible="openedPanels.includes(detail.name)"

              v-model:mode="detail.mode"
              @update:mode="handleDetailTab(detail.name)"

              @create="detail.handleCreate(() => handleDetailPanel(detail.name))"
            />

          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <component :is="detail.component"></component>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  `
}
