import RequestModel from './request.model.js'
import EditableKeyValue from './details/editable-key-value.js'
import Body from './details/body.js'

import TabsService from '../../tabs/tabs.service.js'
import TabMixin from '../../tabs/tab.mixin.js'

import HotkeysService from '../../hotkeys/hotkeys.service.js'

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
  mixins: [
    TabMixin,
  ],

  components: {
    DetailTitle,
    EditableKeyValue,
    Body,
  },

  emits: [
    'send',
  ],

  data() {
    return {
      request: TabsService.get(this.tabId).request,
      rawVisible: false,

      methodMenuOpened: false,
      methodPickerNavIndex: 0,

      detailsTab: null,
      detailsPanels: [],

      bodyMode: 'raw',
    }
  },

  computed: {

    methods() {
      return RequestModel.methods
    },

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

    handleTogglePanel() {
      this.rawVisible = !this.rawVisible
    },

    send() {
      if (!this.request.hasErrors()) {
        this.$emit('send', this.request)
      }
    },

    async handleSend() {
      this.send()
    },

    handleMethodChange(method) {
      this.request.method = method
      this.methodMenuOpened = false

      this.send()
    },

    handleMenuEnter() {
      this.handleMethodChange(this.methods[this.methodPickerNavIndex])
    },

    handleOpenMethodMenu() {
      this.methodMenuOpened = this.isActiveTab
    },

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

    methodMenuOpened(opened) {
      let interval = null

      if (opened) {
        this.methodPickerNavIndex = this.methods.findIndex( m => m == this.request.method)

        // focus hack :(
        Vue.nextTick(() => {
          interval = setInterval(() => {
            if (this.methodMenuOpened) {
              this.$refs.methodMenuList.$el.focus()
            }

            if (this.$refs.methodMenuList.$el == document.activeElement) {
              clearInterval(interval)
            }
          }, 1)
        })
      }
    },

    isActiveTab(active) {
      if (!active) {
        this.methodMenuOpened = false
      }
    },

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

  mounted() {

    HotkeysService.set('request.url', () => {
      this.$refs.url.focus()
    })

    HotkeysService.set('request.method', () => {
      this.handleOpenMethodMenu()
    })

  },

  template: `
    <div class="_http_request">
      <component is="style">
        ._http_request {
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

      <div>
        <div class="section-title">
          {{ t.request.title }}
          <v-btn
            ref="altButton"
            @click="handleTogglePanel()"
            :icon="rawVisible ? 'mdi-arrow-left' : 'mdi-text'" rounded="0" density="compact" variant="tonal"
          />

          <v-tooltip
            v-if="!rawVisible"
            :text="t.request.rawHttp"
            :activator="$refs.altButton"
            open-delay="1000"
          />
        </div>

        <div v-if="rawVisible">
          <pre>{{ request.text }}</pre>
        </div>

        <div v-else>
          <v-form @submit.prevent="handleSend" style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <v-text-field
              v-model="request.url"
              ref="url"

              label="URL"
              required
              :rules="request.rules('url')"
              hide-details
            />

            <v-btn-group
              ref="methodGroup"
              divided
            >
              <v-btn
                :text="request.method"
                type="submit"
                width="96"
              />

              <v-btn
                ref="methodChevron"
                icon="mdi-chevron-down"
              />

              <v-menu
                v-model="methodMenuOpened"
                :activator="$refs.methodChevron"
                :target="$refs.methodGroup"
                location="bottom"
              >
                <v-list
                  :items="methods"
                  ref="methodMenuList"

                  v-model:navigation-index="methodPickerNavIndex"
                  navigationStrategy="track"
                  @update:selected="handleMethodChange($event[0])"
                  @keydown.enter.exact="handleMenuEnter()"
                />
              </v-menu>

            </v-btn-group>
          </v-form>

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
                  <span class="detail-name">
                    {{ t.request.details[name].name }}
                  </span>
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
      </div>
    </div>
  `
}
