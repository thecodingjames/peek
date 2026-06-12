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
      tab: null,
      panels: [],
    }
  },

  computed: {

    details() {
      return [
        {
          name: 'query',
          component: () => Vue.h(EditableKeyValue, {
            items: this.request.query,
            'onCreate': (index) => {
              this.request.queryModel.create(index)
            },
            'onEdit': () => {
              this.request.queryModel.applyToUrl()
            },
            'onSort': (oldIndex, newIndex) => {
              this.request.queryModel.sort(oldIndex, newIndex)
            },
            'onDelete': (id) => {
              this.request.queryModel.remove(id)
            }
          }),

          count: Vue.computed( () => this.request.queryModel.actives.length ),

          handleCreate: (handleDetail) => {
            this.request.queryModel.create()
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
            'onCreate': (index) => {
              this.request.headersModel.create(index)
            },
            'onSort': (oldIndex, newIndex) => {
              this.request.headersModel.sort(oldIndex, newIndex)
            },
            'onDelete': (id) => {
              this.request.headersModel.remove(id)
            }
          }),

          count: Vue.computed( () => this.request.headersModel.actives.length ),

          handleCreate: (handleDetail) => {
            this.request.headersModel.create()

            handleDetail()
          },
        }
      ]
    },

  },

  methods: {

    handleTabSelect(tab) {
      if (this.tab == tab) {
        this.tab = null
        this.handlePanelSelect(this.panels.filter( p => p != tab ))
      } else {
        this.tab = tab
        this.handlePanelSelect([...this.panels, tab])
      }
    },

    handlePanelSelect(changedPanels) {
      const deleted = this.panels.filter( i => !changedPanels.includes(i) )[0]
      const added = changedPanels.filter( i => !this.panels.includes(i) )[0]

      if (added) {
        this.tab = added
        this.panels = this.panels.filter( p => p == added ) // avoid duplicate
      } else if (deleted == this.tab) {
        this.tab = null
      }

      this.panels = changedPanels
    },

  },

  template: `
    <div class="_http_request_details">
      <component is="style">
        ._http_request_details {

          .v-tab,.v-expansion-panel {
            --c: color-mix(in srgb, currentColor calc(var(--v-activated-opacity) * 100%), transparent);
            background-color: var(--c);
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
              display: none;
            }

            .vertical-panels {
              display: block;
            }
          }
        }
      </component>

      <div class="horizontal-tabs">
        <v-tabs
          :model-value="tab"
          :class="{ rounded: !tab, 'rounded-t': tab }"
          density="compact"
          grow
        >
          <v-tab
            v-for="detail of details"

            :value="detail.name"

            @click="handleTabSelect(detail.name)"
            :selected-class="tab ? 'v-tab--selected' : ''"
          >
            <detail-title
              :detail
              :visible="tab == detail.name"

              v-model:mode="detail.mode"
              @update:mode="handleTabSelect(detail.name)"

              @create="detail.handleCreate(() => handleTabSelect(detail.name))"
            />
          </v-tab>
        </v-tabs>

        <v-expand-transition>
          <v-tabs-window
            v-if="tab"
            :model-value="tab"
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

        :model-value="panels"
        @update:model-value="handlePanelSelect"
      >
        <v-expansion-panel
          v-for="detail of details"
          :value="detail.name"
        >
          <v-expansion-panel-title 
            style="min-height: 2.5rem; padding-top: 0; padding-bottom: 0;"
            density="compact"
          >
            <detail-title
              :detail
              :visible="panels.includes(detail.name)"

              v-model:mode="detail.mode"
              @update:mode="handlePanelSelect([detail.name])"

              @create="detail.handleCreate(() => handlePanelSelect([detail.name]))"
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
