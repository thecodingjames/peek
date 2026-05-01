export default {
  props: [
    'title'
  ],

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
        <v-btn v-tooltip="{ text: 'raw', openDelay: 1000 }" icon="mdi-text-box-outline" rounded="0" density="compact" variant="text" />
      </template>

      <slot name="main"></slot>
      <slot name="raw"></slot>
      
    </v-card>
  `
}
