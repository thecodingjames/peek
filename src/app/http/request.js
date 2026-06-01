import Request from './request.model.js'
import EditableKeyValue from './request-details/editable-key-value.js'
import Body from './request-details/body.js'

import TabsService from '../tabs/tabs.service.js'
import TabMixin from '../tabs/tab.mixin.js'

import HotkeysService from '../hotkeys/hotkeys.service.js'

export default {
  mixins: [
    TabMixin,
  ],

  components: {
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
    }
  },

  computed: {

    methods() {
      return Request.methods
    },

    details() {
      return {
        query: () => Vue.h(EditableKeyValue, {
          modelValue: this.request.query,
          'onUpdate:modelValue': (value) => this.request.query = value
        }),

        body: () => Vue.h(Body, {
        }),

        headers: () => Vue.h(EditableKeyValue, {
          modelValue: this.request.headers,
          'onUpdate:modelValue': (value) => this.request.headers = value
        }),
      }
    },

    openedPanels() {
      let panels = [ ...this.detailsPanels ]

      if (!panels.includes(this.detailsTab)) {
        panels.push(this.detailsTab)
      }

      return panels
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
      if (this.detailsTab == tab) {
        this.detailsTab = null
      } else {
        this.detailsTab = tab
      }
    },

    handlePanelClick(panels) {
      this.detailsPanels = panels
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

    detailsPanels(panels, previous) {
      const deleted = previous.filter( i => !panels.includes(i) )

      if (this.detailsTab == deleted) {
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
            display: nnone;
          }

          .v-expansion-panel-text__wrapper {
            padding: 0;
          }

          @media (min-width: 960px) {
            .horizontal-tabs {
              display: nnone;
            }

            .vertical-panels {
              display: block;
            }
          }
        }
      </component>
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
        <v-form @submit.prevent="handleSend" style="display: flex; gap: 1rem;">
          <v-text-field
            v-model="request.url"
            ref="url"

            label="URL"
            required
            :rules="request.rules('url')"
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
            :model-value="detailsTab"
            :class="{ rounded: !detailsTab, 'rounded-t': detailsTab }"
            density="compact"
            grow
          >
            <v-tab
              v-for="(componentFn, name) of details"

              :value="name"

              @click="handleTabClick(name)"
              :selected-class="detailsTab ? 'v-tab--selected' : ''"
            >
              {{ name }}
            </v-tab>
          </v-tabs>

          <v-tabs-window
            v-if="detailsTab"
            v-model="detailsTab"
          >
            <v-tabs-window-item
              v-for="(componentFn, name) of details"
              :value="name"
              class="rounded-b"
            >
              <component :is="componentFn"></component>
            </v-tabs-window-item>
          </v-tabs-window>
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
            v-for="(componentFn, name) of details"
            :value="name"
          >
            <v-expansion-panel-title 
              style="background-color: var(--bg); min-height: 2.5rem; padding-top: 0; padding-bottom: 0;"
              density="compact"
              class="text-label-large"
            >
              {{ name }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <component :is="componentFn"></component>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

      </div>
    </div>
  `
}
