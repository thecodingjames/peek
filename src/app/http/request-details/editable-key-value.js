export default {

  emits: [
    'update:modelValue',
    'delete',
  ],

  props: [
    'modelValue',
  ],

  methods: {
    handleDelete(id) {
      this.$emit('delete', id)
    }
  },

  mounted() {
    this.sortable = Sortable.create(this.$refs.items, {
      handle: '.sort-handle',
      direction: 'vertical',
      scroll: true,

      onEnd: ({ oldIndex, newIndex }) => {
        const moved = this.modelValue.splice(oldIndex, 1)[0]
        this.modelValue.splice(newIndex, 0, moved)
      },  
    })
  },

  beforeUnmount() {
    this.sortable?.destroy()
  },

  template: `
    <v-table class="_http_request-details_editable-key-value">
      <component is="style">
        ._http_request-details_editable-key-value {
          .sort-handle:hover {
            cursor: move;
          }

          tr[disabled=true]>*:not(.no-disable) {
            opacity: 40%; 
          }

          .sortable-chosen {
            background-color: lightgray;
          }

          .sortable-ghost * {
            opacity: 0 !important;
          }
        }
      </component>

      <tbody ref="items">
        <tr
          v-for="item in modelValue"
          :key="item._id"

          :disabled="!item.enabled"
        >
          <td class="no-disable">
            <v-icon icon="mdi-drag-vertical" class="sort-handle" />
          </td>

          <td>
            <v-checkbox
              v-model="item.enabled"
              hide-details
            />
          </td>

          <td>
            <v-text-field
              v-model="item.key"
              density="compact"
              hide-details
            />
          </td>

          <td>
            <v-text-field
              v-model="item.value"
              density="compact"
              hide-details
            />
          </td>

          <td class="no-disable">
            <v-btn
              @click.stop="handleDelete(item._id)"

              color="red"
              size="x-small"
              variant="outlined"
              style="margin-right: 1rem; min-width: 0; aspect-ratio: 1;"
            >
            ㄨ
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  `
}
