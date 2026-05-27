import MessageCard from './message-card.js'
import Request from './request.model.js'

import TabMixin from '../tabs/tab.mixin.js'

import HotkeysService from '../hotkeys/hotkeys.service.js'

export default {
  mixins: [
    TabMixin,
  ],

  components: {
    MessageCard,
  },

  emits: [
    'send',
  ],

  data() {
    return {
      request: new Request(),

      methodMenuOpened: false,
      methodPickerNavIndex: 0,
    }
  },

  methods: {

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
    }

  },

  computed: {

    methods() {
      return Request.methods
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
    }

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
    <message-card
      :title="t.request.title"
      :alt-text="t.request.rawHttp"
      icon="mdi-text"
    >
      <template #main>
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
      </template>

      <template #alt>
        <pre>{{ request.text }}</pre>
      </template>

    </message-card>
  `
}
