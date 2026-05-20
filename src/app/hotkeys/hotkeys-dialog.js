export default {
  model: {
    prop: 'visible',
  },

  props: {
    visible: {
      type: [Boolean],
      default: false
    }
  },

  template: `
    <v-dialog
      :model-value="visible"
      @update:model-value="$emit('update:visible', $event)"
      width="auto"
    >
      <v-card
        max-width="400"
        text="..."
        title="Hotkeys"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="$emit('update:visible', false)"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  `
}
