import { forceFocus } from '../../core/helpers.js'

import RequestModel from './request.model.js'
import Details from './details/details.js'

import TabsService from '../../tabs/tabs.service.js'
import TabMixin from '../../tabs/tab.mixin.js'

import HotkeysService from '../../hotkeys/hotkeys.service.js'

export default {
  mixins: [
    TabMixin,
  ],

  components: {
    RequestDetails: Details,
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
    }
  },

  computed: {

    methods() {
      return RequestModel.methods
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

  },

  watch: {

    methodMenuOpened(opened) {
      if (opened) {
        this.methodPickerNavIndex = this.methods.findIndex( m => m == this.request.method)

        forceFocus(() => {
          if(this.methodMenuOpened) {
            return this.$refs.methodMenuList.$el
          }
        })
      }
    },

    isActiveTab(active) {
      if (!active) {
        this.methodMenuOpened = false
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
        <form @submit.prevent="handleSend" style="display: flex; gap: 1rem; margin-bottom: 1rem;">
          <!-- Needed dependency with request.query to trigger re-render of url... :( -->
          <span v-show="false">{{ request.query }}</span>
          <v-text-field
            v-model="request.url"
            ref="url"
            :rules="request.rules('url')"

            label="URL"
            required
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
        </form>
      </div>

      <request-details :request />
    </div>
  `
}
