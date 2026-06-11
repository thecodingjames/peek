import { forceFocus } from '../../../core/helpers.js'

export default {

  emits: [
    'create',
    'edit',
    'sort',
    'delete',
  ],

  props: [
    'items',
  ],

  data() {
    return {
      focusIndex: null,
    }
  },

  methods: {

    handleCreate(index) {
      this.focusIndex = index + 1

      this.$emit('create', index)
    },

    handleEdit() {
      this.$emit('edit')
    },

    handleSort({oldIndex, newIndex}) {
      this.$emit('sort', oldIndex, newIndex)
    },

    handleDelete(id) {
      this.$emit('delete', id)
    },

  },

  watch: {

    items(items) {
      if (this.focusIndex) {
        const index = this.focusIndex
        this.focusIndex = null

        forceFocus(() => this.$refs.items.children[index]?.querySelector('input[type=text]'))
      }
    }

  },

  mounted() {
    this.sortable = Sortable.create(this.$refs.items, {
      handle: '.sort-handle',
      direction: 'vertical',
      scroll: true,

      onEnd: this.handleSort,
    })
  },

  beforeUnmount() {
    this.sortable?.destroy()
  },

  template: `
    <v-table
      v-show="items.length > 0"

      class="_http_request-details_editable-key-value"
    >
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
          v-for="(item, index) in items"
          :key="item.id"

          :disabled="!item.enabled || item.key.trim() == ''"
        >
          <td class="min-width">
            <v-icon 
              :disabled="items.length <= 1"
              icon="mdi-drag-vertical" 
              class="sort-handle" 
            />
          </td>

          <td class="min-width">
            <v-checkbox
              v-model="item.enabled"
              @update:modelValue="handleEdit"
              hide-details

              style="width: 16px; margin-left: -8px; margin-right: 16px;"
            />
          </td>

          <td class="can-disable">
            <v-form
              @submit.prevent="handleCreate(index)"
              style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;"
            >
              <v-text-field
                v-model="item.key"
                @update:modelValue="handleEdit"

                density="compact"
                hide-details
              />

              <v-text-field
                v-model="item.value"
                @update:modelValue="handleEdit"

                density="compact"
                hide-details
              />
              <button style="display: none;">never shown, needed to allow Enter to trigger</button>
            </v-form>
          </td>

          <td class="min-width">
            <v-btn
              @click.stop="handleDelete(item.id)"

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

    <div
      v-show="items.length == 0"
      style="margin-left: 1.5rem; padding: 0.5rem 0; font-style: italic;"
    >
      <span>{{ t.request.details.keyValue.empty }}</span>
    </div>
  `
}
