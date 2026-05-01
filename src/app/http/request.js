import MessageCard from '/app/http/message-card.js'

export default {
  components: {
    MessageCard,
  },

  template: `
    <message-card
      title="request"
    >
      <template #main>
        <v-autocomplete
          :items="['GET', 'POST']"
          item-title="name"
          label="Method"
          :auto-select-first="true"
          :clearable="true"
          variant="outlined"
        />

        <v-text-field
          label="URL"
          required
          variant="outlined"
        />

        <v-btn>Send</v-btn>
      </template>

      <template #raw>
        ...raw... 
      </template>

    </message-card>
  `
}
