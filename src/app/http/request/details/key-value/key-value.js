import { forceFocus } from '../../../../core/helpers.js'

export default {

  emits: [
    'create',
    'edit',
    'sort',
    'delete',
  ],

  props: [
    'items',
    'altInputs',

    'disabled',
  ],

  data() {
    return {
      focusIndex: null,

      dialogItem: null,
    }
  },

  computed: {

    inputs() {
      return [
        {
          name: 'raw',
          tag: 'dialog-editable-input',
          default: '',
          modelValue(item) {
            return item.value.content
          },
          updateModelValue(item, value) {
            item.value.content = value
          },
        },
        ...(this.altInputs ?? []),
      ]
    },

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

    inputIndex(item) {
      return this.inputs.findIndex( input => input.name == item.value.mode )
    },

    inputNextIndex(item) {
      const index = this.inputIndex(item)

      return (index + 1) % this.inputs.length
    },

    input(item) {
      return this.inputs.find( i => i.name == item.value.mode )
    },

    nextIcon(item) {
      return this.inputs[this.inputNextIndex(item)].icon ?? 'mdi-text-short'
    },

    handleToggleInputs(item) {
      item.value.mode = this.inputs[this.inputNextIndex(item)].name

      this.handleClear(item)
    },

    handleClear(item) {
      item.value = {
        mode: item.value.mode,
        content: this.input(item).default,
      }
    },

    handleOpenValueDialog(item) {
      this.dialogItem = item
    },

    handleClose() {
      this.dialogItem = null

      this.handleEdit()
    },

  },

  watch: {

    'items.length'(length, previous) {
        const index = this.focusIndex ?? (() =>{
          if (length > previous) {
            return length - 1
          }
        })()

        this.focusIndex = null

        if (index >= 0) {
          const id = this.items[index].id

          forceFocus(() => this.$refs.items.querySelector(`[id="${id}"]`))
        }
      },
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

    <dialog-editable
      :model-value="!!dialogItem"
      @update:model-value="handleClose"

      :title="dialogItem?.key"
      :content="dialogItem?.value?.content"

      @save="dialogItem.value.content = $event"
    />

    <div
      v-show="items.length > 0"
    >

      <slot name="prepend" />

      <v-table
        class="_http_request-details_key-value"
      >
        <component is="style">
          ._http_request-details_key-value {
            .sort-handle:hover {
              cursor: move;
            }

            tr[disabled=true] .can-disable>* {
              opacity: 30%;
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

        <tbody ref="items" style="background-color: rgb(var(--v-theme-background));">
          <tr
            v-for="(item, index) in items"
            :key="item.id"

            :disabled="disabled?.(item) || !item.enabled || item.key.trim() == ''"
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

            <td>
              <v-form
                @submit.prevent="handleCreate(index)"
                style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;"
              >
                <v-text-field
                  :id="item.id"

                  v-model="item.key"
                  @update:modelValue="handleEdit"

                  density="compact"
                  hide-details

                  class="can-disable"
                />

                <div style="display: flex; gap: 0.25rem;">
                  <component
                    :is="input(item).tag"

                    :modelValue="input(item).modelValue(item)"
                    @update:modelValue="input(item).updateModelValue(item, $event); handleEdit();"
                    @click:clear="handleClear(item)"

                    @openDialog="handleOpenValueDialog(item)"

                    :label="input(item).label"
                    :prepend-inner-icon="input(item).icon"

                    prepend-icon=""
                    single-line
                    density="compact"
                    hide-details

                    class="can-disable"
                  />
                  <v-btn
                    v-if="altInputs"
                    @click="handleToggleInputs(item)"

                    style="height: 100%; padding: 0; min-width: 0; aspect-ratio: 1;"
                  >
                    <v-icon :icon="nextIcon(item)" />
                  </v-btn>

                </div>

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
    </div>

    <div
      v-show="items.length == 0"
      style="margin-left: 0.75rem; padding: 0.5rem 0; font-style: italic;"
    >
      <span>{{ t.request.details.keyValue.empty }}</span>
    </div>
  `
}
