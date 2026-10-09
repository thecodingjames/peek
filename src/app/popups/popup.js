export const mixin = {
  props: [
    'source',
  ],

  emits: [
    'hide',
  ],
  
  methods: {

    handleHide() {
      this.$emit('hide')
    },

  },

}

export default {
  mixins: [
    mixin
  ],

  template: `
    <v-menu
      ref="menu"

      :model-value="source.visible"
      @update:model-value="handleHide()"

      :target="source.element"
      :close-on-content-click="false"
      location="bottom"
    >
      <v-card min-width="300">
        <slot></slot>
      </v-card>
    </v-menu>
  `
}
