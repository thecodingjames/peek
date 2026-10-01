import { forceFocus } from '../../core/helpers.js'

export default {

  props: [
    'title',
    'variant',
    'autofocus',
  ],

  emits: [
    'submit',
  ],

  data(props) {
    return {
      value: props.title
    }
  },

  watch: {

    title(newTitle) {
      this.value = newTitle
    },

  },

  methods: {

    handleSubmit() {
      this.$emit('submit', this.value)
    },

  },

  mounted() {
    if (this.autofocus) {
      forceFocus( () => this.$refs.input.controlRef )
    }
  },

  template: `
    <component is="style">
      ._tabs_popup_rename-form {
        
        input {
          padding: 0;
        }
      }
    </component>

    <form
      class="_tabs_popup_rename-form"

      @submit.prevent="handleSubmit()"
      style="display: flex; align-items: center;"
    >
      <v-text-field
        ref="input"

        v-model="value"

        placeholder="Title"
        :label="variant ? 'Rename' : ''"

        :persistent-placeholder="true"
        :hide-details="true"
        :variant="variant ?? 'plain'"
        density="comfortable"
        tile
      />

      <v-btn
        type="submit"
        icon="mdi-check"
        color="green"
        variant="tonal"
        density="compact"
        style="margin-right: 0.5rem;"
      />
    </form>
  `
}
