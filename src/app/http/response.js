import MessageCard from './message-card.js'

export default {
  components: {
    MessageCard,
  },

  props: [
    'response',
  ],

  computed: {
    html() {
      // TODO add more content types detection
      return this.response?.blob?.replace('<head>', `<head><base href="${this.response?.url}">`);
    },
  },
    
  template: `
    <message-card
      title="response"
      icon="mdi-format-color-highlight"
      alt-text="Formatted preview"
    >
      <template #main>
        <pre style="user-select: text; cursor: text;">{{ response?.blob ?? 'nothing to show...' }}</pre>
      </template>

      <template #alt>
        <iframe 
          v-if="response" 
          :srcdoc="html" frameborder="0"
          style="width: 100%; height: 100dvh;"
        ></iframe>
        <p v-else>no preview...</p>
      </template>
    </message-card>
  `
}
