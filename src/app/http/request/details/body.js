import EditableKeyValue from './editable-key-value.js'

export default {
  components: {
    EditableKeyValue,
  },

  props: [
    'body',

    'create',
    'edit',
    'sort',
    'delete',
  ],

  template: `
    <v-textarea 
      v-if="body.mode == 'raw'"
      v-model="body.raw"

      style="margin: 0.5rem; margin-bottom: 1rem;"
      variant="outlined"
      hide-details
    />

    <EditableKeyValue
      v-else

      :items="body.pairs"
      
      @create="create"
      @edit="edit"
      @sort="sort"
      @delete="$props.delete"
    />
  `
}
