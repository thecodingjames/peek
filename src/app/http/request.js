import MessageCard from './message-card.js'
import Request from './request.model.js'

export default {
  components: {
    MessageCard,
  },

  emits: [
    'send'
  ],

  data() {
    return {
      request: new Request(),
    }
  },

  methods: {

    send() {
      this.$emit('send', this.request)
    },

    async handleSend() {
      this.send()
    },

    handleMethodChange(method) {
      this.request.method = method

      this.send()
    },

  },

  computed: {
    methods() {
      return Request.methods
    },
  },

  template: `
    <message-card
      title="request"
      icon="mdi-text"
      alt-text="Raw HTTP"
    >
      <template #main>
        <v-form @submit.prevent="handleSend" style="display: flex; gap: 1rem;">
          <v-text-field
            v-model="request.url"
            label="URL"
            required
            :rules="request.rules('url')"
          />

          <v-btn-group divided>
            <v-btn :disabled="request.hasErrors()" type="submit">{{ request.method }}</v-btn>

            <v-menu location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn :disabled="request.hasErrors()" v-bind="props" icon="mdi-chevron-down"></v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="(method) in methods"
                  :key="method"
                  :value="method"
                  @click="handleMethodChange(method)"
                >
                  <v-list-item-title>{{ method }}</v-list-item-title>
                </v-list-item>
              </v-list>
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
