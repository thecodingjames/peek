export default {

  model: {
    prop: 'visible',
  },

  emits: [
    'update:modelValue'
  ],

  props: [
    'visible'
  ],

  methods: {
    
    handle(visible) {
      this.$emit('update:modelValue', visible)
    },

  },

  template: `
    <v-dialog
      :model-value="visible"
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
