export const mixin = {
  props: [
    'context',
  ],

  emits: [
    'rename',
  ],
  
  methods: {

    handleRename(name) {
      this.$emit('rename', name)
    },

  },

}

export default {
  mixins: [
    mixin
  ],

  mounted() {
    this.$refs.menu.animateClick = () => {
      // this.renaming = null
    }
  },

  template: `
    <v-menu
      ref="menu"

      :model-value="context.visible"
      @update:model-value="context.visible = false"

      :target="context.element"
      :close-on-content-click="false"
      location="bottom"
    >
      <v-card min-width="300">
        <slot></slot>
      </v-card>
    </v-menu>
  `
}
