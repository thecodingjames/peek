import MessageCard from './message-card.js'

export default {
  components: {
    MessageCard,
  },

  props: [
    'result'
  ],

  template: `
    <message-card
      title="response"
      icon="mdi-format-color-highlight"
      alt-text="Formatted preview"
    >
      <template #main>
        <pre style="user-select: text; cursor: text;">{{ result }}</pre>
      </template>

      <template #alt>
        ...preview... 
      </template>
    </message-card>
  `
}
