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
    },
  },

  template: `
    <component is="style">
      .http_message-card .title {
        font-weight: bold !important;
        text-align: start;
        text-transform: uppercase;
        font-size: 0.8rem;
        margin-bottom: 1rem;
      }
    </component>

    <div class="http_message-card">
      <div class="title">
        {{ title }}
        <v-btn 
          v-if="icon"
          @click="handleTogglePanel()"
          v-tooltip="{ text:  tooltipText, openDelay: 1000 }" :icon="buttonIcon" rounded="0" density="compact" variant="tonal" />
      </div>

      <slot v-if="$slots.main && slot == 'main'" name="main"></slot>
      <slot v-else></slot>
      <slot name="alt" v-if="slot == 'alt'"></slot>
      
    </div>
  `
}
