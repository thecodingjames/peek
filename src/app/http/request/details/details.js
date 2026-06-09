import EditableKeyValue from './editable-key-value.js'
import Body from './body.js'

const DetailTitle = {

  props: [
    'visible',
    'create',
    'modes',
    'mode',
  ],

  emits: [
    'create',
    'update:mode',
  ],

  methods: {
    handleToggle() {
      const currentMode = this.modes.findIndex( mode => mode == this.mode) 
      const newIndex = (currentMode + 1) % this.modes.length

      this.$emit('update:mode', this.modes[newIndex])
    }
  },

  template: `
    <span>
      <v-btn
        v-if="modes"

        @click.stop="handleToggle"

        size="x-small"
        variant="outlined"
        style="margin-right: 1rem; min-width: 0; aspect-ratio: 1;"
      >
      ⇄
      </v-btn>

      <v-btn
        @click.stop="$emit('create')"

        color="success"
        size="x-small"
        variant="outlined"
        :style="{ visibility: (create ? 'visible' : 'hidden') }"
        style="min-width: 0; aspect-ratio: 1; border-radius: 99px; font-size: 1rem; line-height: 19px;"
      >+</v-btn>
    </span>
  `
}

export default {

  components: {
    DetailTitle
  },

  props: [
    'request',
  ],

  data() {
    return {
      detailsTab: null,
      detailsPanels: [],

      bodyMode: 'raw',
    }
  },

  computed: {

    details() {
      return {
        query: {
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

          count: () => this.request.query.length,

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

          create: this.bodyMode == 'form',

          count: () => undefined,

          handleCreate: (handleDetail) => {
            console.log('body create')
            handleDetail()
          },

        },

        */
        headers: {
          component: () => Vue.h(EditableKeyValue, {
            items: this.request.headers,
            'onSort': (oldIndex, newIndex) => {
              this.request.sortHeaders(oldIndex, newIndex)
            },
            'onDelete': (id) => {
              this.request.removeHeader(id)
            }
          }),

          count: () => this.request.headers.length,

          handleCreate: (handleDetail) => {
            this.request.addHeader()

            handleDetail()
          },
        }
      }
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

          .detail-name {
            text-transform: uppercase;
            font-size: 0.7rem;
            font-weight: bold;
            letter-spacing: 0.01rem;
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
          :model-value="openedTab"
          :class="{ rounded: !openedTab, 'rounded-t': openedTab }"
          density="compact"
          grow
        >
          <v-tab
            v-for="(detail, name) of details"

            :value="name"

            @click="handleTabClick(name)"
            :selected-class="openedTab ? 'v-tab--selected' : ''"
          >
            <template v-slot:default>
              <v-badge
                :content="detail.count()"

                tag="span"
                floating
                offset-x="2"
                offset-y="2"
                color="transparent"
                location="top right"
                class="detail-name"
              >
                {{ t.request.details[name].name }}
              </v-badge>
            </template>

            <template v-slot:append>
              <detail-title
                :visible="openedTab == name"
                :create="detail.create ?? true"

                :modes="detail.modes"
                v-model:mode="bodyMode"
                @update:mode="handleDetailTab(name)"

                @create="detail.handleCreate(() => handleDetailTab(name))"
              />
            </template>
          </v-tab>
        </v-tabs>

        <v-expand-transition>
          <v-tabs-window
            v-if="openedTab"
            :model-value="openedTab"
          >
            <v-tabs-window-item
              v-for="(detail, name) of details"
              :value="name"
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
          v-for="(detail, name) of details"
          :value="name"
        >
          <v-expansion-panel-title 
            style="background-color: var(--bg); min-height: 2.5rem; padding-top: 0; padding-bottom: 0;"
            density="compact"
          >
            <span class="detail-name" style="margin-right: 0.5rem;">
              {{ t.request.details[name].name }}
            </span>

            <detail-title
              :visible="openedPanels.includes(name)"
              :create="detail.create ?? true"

              :modes="detail.modes"
              v-model:mode="bodyMode"
              @update:mode="handleDetailTab(name)"

              @create="detail.handleCreate(() => handleDetailPanel(name))"
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
