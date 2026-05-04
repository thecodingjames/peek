import MessageCard from './message-card.js'

export default {
  components: {
    MessageCard,
  },

  emits: [
    'send'
  ],

  data() {
    return {
      options: {
        method: 'GET',
        url: undefined,
      }
    }
  },

  methods: {
    async handleSend() {
      this.$emit('send', this.options)
    }
  },

  template: `
    <message-card
      title="request"
      icon="mdi-text"
      alt-text="Raw HTTP"
    >
      <template #main>
        <v-autocomplete
          v-model="options.method"
          :items="['GET', 'POST']"
          item-title="name"
          label="Method"
          :auto-select-first="true"
          :clearable="true"
          variant="outlined"
        />

        <v-text-field
          v-model="options.url"
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
