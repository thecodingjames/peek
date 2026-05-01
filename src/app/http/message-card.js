export default {
  props: [
    'title',
    'icon',
    'altText',
  ],

  data() {
    return {
      slot: 'main',
    }
  },

  methods: {
    
    handleTogglePanel() {
      const toggle = {
        main: 'alt',
        alt: 'main',
      }

      this.slot = toggle[this.slot]
    }

  },

  computed: {

    tooltipText() {
      return this.slot == 'main' ? this.altText : `Back to ${this.title}`
    },

    buttonIcon() {
      return this.slot == 'main' ? this.icon : 'mdi-arrow-left'
    }

  },

  template: `
    <component is="style">
      .http_message-card .v-card-title {
        font-weight: bold !important;
        text-align: start;
        text-transform: uppercase;
        font-size: 0.8rem;
      }
    </component>

    <v-card
      variant="text"
      class="http_message-card"
    >
      <template #title>
        {{ title }}
        <v-btn 
          @click="handleTogglePanel()"
          v-tooltip="{ text:  tooltipText, openDelay: 1000 }" :icon="buttonIcon" rounded="0" density="compact" variant="tonal" />
      </template>

      <slot name="main" v-if="slot == 'main'"></slot>
      <slot name="alt" v-if="slot == 'alt'"></slot>
      
    </v-card>
  `
}
