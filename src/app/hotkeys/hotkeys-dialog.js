export default {
  emits: [
    'update:modelValue'
  ],

  props: [
    'modelValue'
  ],

  methods: {
    
    handle(visible) {
      this.$emit('update:modelValue', visible)
    },

  },

  template: `
    <v-dialog
      :model-value="modelValue"
      @update:model-value="handle($event)"
      width="auto"
    >
      <v-card
        max-width="400"
        text="..."
        title="Hotkeys"
      >
        <template v-slot:actions>
          <v-btn
            text="Ok"
            @click="handle(false)"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  `
}
