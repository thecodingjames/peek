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

  computed: {

    altInputs() {
      return [
        {
          tag: 'v-file-input',
          default: [],
          label: 'TODO file',
          icon: 'mdi-paperclip',
        }
      ]
    },

  },

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
      :altInputs
      
      @create="create"
      @edit="edit"
      @sort="sort"
      @delete="$props.delete"
    />
  `
}
