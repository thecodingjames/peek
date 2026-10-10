import { forceFocus } from '../../core/helpers.js'

import RequestModel from './request.model.js'
import Details from './details/details.js'

import TabsService from '../../tabs/tabs.service.js'
import TabMixin from '../../tabs/tab.mixin.js'

import HotkeysService from '../../hotkeys/hotkeys.service.js'

import PopupList from '../../popups/popup-list.js'

export default {
  mixins: [
    TabMixin,
  ],

  components: {
    RequestDetails: Details,
    PopupList,
  },

  emits: [
    'send',
    'cancel',
  ],

  data() {
    return {
      request: TabsService.get(this.tabId).request,
      rawHttp: null,

      loading: false,
      loadingStopTimeout: null,

      methodMenuOpened: false,
      methodPickerNavIndex: 0,

      dialogUrl: null,

      requestPopup: {
        visible: false,
        element: null,
      },

    }
  },

  computed: {

    methods() {
      return RequestModel.methods
    },

    requestActions() {

      return {
        duplicate: () => { 
          TabsService.duplicate(this.tabId)

          this.handleTogglePopup()
        },

        clear: () => {
          TabsService.clear(this.tabId)
          this.$refs.urlForm.reset()

          this.handleTogglePopup()
        },

      }
    },

  },

  methods: {

    handleTogglePanel() {
      if (this.rawHttp) {
        this.rawHttp = null
      } else {
        this.refreshRawHttp()
      }
    },

    async refreshRawHttp() {
      this.rawHttp = await this.request.text
    },

    handleTogglePopup() {
      this.requestPopup.visible = !this.requestPopup.visible
    },

    handleRequestAction({ action }) {
      this.requestActions[action]()
    },

    handleOpenUrlDialog() {
      this.dialogUrl = this.request.url
    },

    handleSaveUrl(newUrl) {
      this.request.url = newUrl?.replace(/[\r\n]+/g, '') ?? ''

      this.handleCloseUrlDialog()
    },

    handleCloseUrlDialog() {
      this.dialogUrl = null
    },

    send() {
      if (!this.request.hasErrors()) {
        clearTimeout(this.loadingStopTimeout)
        this.loading = true

        this.$emit('send', this.request)
      }
    },

    async handleSend() {
      this.send()
    },

    done() {
      this.loadingStopTimeout = setTimeout(() => {
        this.loading = false
      }, 150)
    },

    handleCancelRequest() {
      this.done()

      this.$emit('cancel')
    },

    handleMethodChange(method) {
      this.request.method = method
      this.methodMenuOpened = false
    },

    handleMenuEnter() {
      this.handleMethodChange(this.methods[this.methodPickerNavIndex])
    },

    handleOpenMethodMenu() {
      const dialogOpen = document.querySelector('.v-overlay-container [role=dialog]')

      if (this.isActiveTab && !this.rawHttp && !dialogOpen) {
        this.methodMenuOpened = Date.now()
      }
    },

    handleCloseMethodMenu() {
      if (Date.now() - this.methodMenuOpened > 77 || this.methodMenuOpened === false) {
        // reject quick value change, glitch :(
        this.methodMenuOpened = false
      }
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

    request: {
      handler: function() {
        if (this.rawHttp) {
          this.refreshRawHttp()
        }
      },
      deep: true,
    },

  },

  mounted() {

    HotkeysService.set('request.url', () => {
      this.$refs.url.focus()
    })

    HotkeysService.set('request.method', () => {
      this.handleOpenMethodMenu()
    })

    HotkeysService.set('request.send', () => {
      this.handleSend()
    })

    this.requestPopup.element = this.$refs.requestActions

  },

  template: `
    <div
      class="_http_request"
      style="height: 100%; overflow-y: hidden; display: flex; flex-direction: column; gap: 1rem;"
    >

       <div class="section-title" style="display: flex; gap: 0.5rem; align-items: center;">
        {{ t.request.title }}
        <v-btn
          ref="altButton"
          @click="handleTogglePanel()"
          :icon="rawHttp ?'mdi-arrow-left' : 'mdi-text'" rounded="0" density="compact" variant="tonal"
        />

        <v-tooltip
          v-if="!rawHttp"
          :text="t.request.rawHttp"
          :activator="$refs.altButton"
          open-delay="1000"
        />

        <div style="flex-grow: 1; display: flex; justify-content: end;">
          <v-btn
            ref="requestActions"

            @click="handleTogglePopup()"
            icon="mdi-dots-horizontal" rounded="0" density="compact" variant="tonal"
          />
        </div>

        <PopupList
          :source="requestPopup"

          :actions="requestActions"
          :translate="t.request.actions"

          @click="handleRequestAction($event)"

          @hide="handleTogglePopup()"
        />
      </div>

      <pre
        v-if="rawHttp"

        v-html="rawHttp"

        class="border rounded-md"
        style="flex-shrink: 0; margin: 0; max-height: 44%; overflow: auto; height: max-content; padding: 0.5rem;"
      ></pre>

      <div v-else>
        <dialog-editable
          :model-value="!!dialogUrl"
          @update:model-value="handleCloseUrlDialog"

          title="URL"
          :content="dialogUrl"
          @save="handleSaveUrl($event)"
        />

        <v-form ref="urlForm" @submit.prevent="handleSend" style="display: flex; gap: 1rem;">
          <!-- Needed dependency with request.query to trigger re-render of url... :( -->
          <span v-show="false">{{ request.query }}</span>

          <dialog-editable-input
            ref="url"

            :modelValue="request.url"
            @update:modelValue="handleSaveUrl($event)"

            @openDialog="handleOpenUrlDialog()"

            :rules="request.rules('url')"

            label="URL"
            hide-details
          />

          <v-btn-group
            ref="methodGroup"
            divided
            variant="outlined"
            style="--v-border-opacity: 0.33;"
          >
            <v-btn
              type="submit"
              width="104"
            >
              {{ request.method }}

              <v-progress-circular
                v-if="loading"

                indeterminate
                size="16"
                width="2"

                style="margin-left: 0.5rem;"
              />
            </v-btn>

            <v-btn
              v-if="loading"

              @click="handleCancelRequest"
              icon="mdi-close-octagon-outline"
            />

            <v-btn
              v-if="!loading"

              ref="methodChevron"
              @click="handleOpenMethodMenu"

              icon="mdi-chevron-down"
            />

            <v-menu
              :model-value="!!methodMenuOpened"

              @update:model-value="handleCloseMethodMenu"
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

                style="padding: 0;"
              />
            </v-menu>

          </v-btn-group>
        </v-form>
      </div>

      <request-details :request style="overflow-y: auto; height: 100%;"/>
    </div>
  `
}
