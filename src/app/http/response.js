import MessageCard from '/app/http/message-card.js'

export default {
  components: {
    MessageCard,
  },

  template: `
    <message-card
      title="response"
    >
      <template #main>
        response
      </template>

      <template #raw>
        ...raw... 
      </template>
    </message-card>
  `
}
