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

          tr[disabled=true] td.can-disable * {
            opacity: 70%; 
          }

          td {
            padding: 0.5rem;
          }

          td.min-width {
            width: 1%;
          }

          .sortable-chosen {
            background-color: color-mix(in srgb, lightgray 20%, transparent);
          }

          .sortable-drag {
            background-color: color-mix(in srgb, currentColor 20%, transparent);
          }

          .sortable-drag *:first-child {
            opacity: 80%;
          }

          .sortable-ghost * {
            opacity: 0 !important;
          }
        }
      </component>

      <tbody ref="items">
        <tr
          v-for="item in modelValue"
          :key="item.id"

          :disabled="!item.enabled || item.key.trim() == ''"
        >
          <td class="min-width">
            <v-icon 
              :disabled="modelValue.length <= 1"
              icon="mdi-drag-vertical" 
              class="sort-handle" 
            />
          </td>

          <td class="min-width">
            <v-checkbox
              v-model="item.enabled"
              hide-details

              style="width: 16px; margin-left: -8px; margin-right: 16px;"
            />
          </td>

          <td class="can-disable">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
              <v-text-field
                v-model="item.key"
                density="compact"
                hide-details
              />

              <v-text-field
                v-model="item.value"
                density="compact"
                hide-details
              />
            </div>
          </td>

          <td class="min-width">
            <v-btn
              @click.stop="handleDelete(item.id)"
              :disabled="modelValue.length <= 1"

              color="red"
              size="x-small"
              variant="outlined"
              style="min-width: 0; aspect-ratio: 1;"
            >
            ㄨ
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  `
}
