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

    async handleSend() {
      this.$emit('send', this.request)
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
        <v-autocomplete
          v-model="request.method"
          :items="methods"

          label="Method"
          :auto-select-first="true"
          :clearable="true"
          variant="outlined"
        />

        <v-text-field
          v-model="request.url"
          label="URL"
          required
          variant="outlined"
        />

        <v-btn @click="handleSend">Send</v-btn>
      </template>

      <template #alt>
        ...raw... 
      </template>

    </message-card>
  `
}
