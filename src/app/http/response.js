import MessageCard from './message-card.js'

export default {
  components: {
    MessageCard,
  },

  props: [
    'options',
    'result',
  ],

  computed: {
    html() {
      // TODO add more content types detection
      return this.result?.replace('<head>', `<head><base href="${this.options?.url}">`);
    },
  },

  template: `
    <message-card
      title="response"
      icon="mdi-format-color-highlight"
      alt-text="Formatted preview"
    >
      <template #main>
        <pre style="user-select: text; cursor: text;">{{ result ?? 'nothing to show...' }}</pre>
      </template>

      <template #alt>
        <iframe 
          v-if="result" 
          :srcdoc="html" frameborder="0"
          style="width: 100%; height: 100dvh;"
        ></iframe>
        <p v-else>no preview...</p>
      </template>
    </message-card>
  `
}
