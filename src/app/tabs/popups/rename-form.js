import { forceFocus } from '../../core/helpers.js'

export default {

  props: [
    'title',
  ],

  emits: [
    'submit',
  ],

  data(props) {
    return {
      value: props.title
    }
  },

  methods: {

    handleSubmit() {
      this.$emit('submit', this.value)
    },

  },

  mounted() {
    forceFocus( () => this.$refs.input.controlRef )
  },

  template: `
    <form
      @submit.prevent="handleSubmit()"
      style="display: flex; align-items: center;"
    >
      <v-text-field
        ref="input"

        v-model="value"

        placeholder="Title"

        :hide-details="true"
        density="comfortable"
        variant="plain"
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
