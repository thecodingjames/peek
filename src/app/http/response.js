import MessageCard from '/app/http/message-card.js'

export default {
  components: {
    MessageCard,
  },

  template: `
    <message-card
      title="response"
      icon="mdi-format-color-highlight"
      alt-text="Formatted preview"
    >
      <template #main>
        raw
      </template>

      <template #alt>
        ...preview... 
      </template>
    </message-card>
  `
}
