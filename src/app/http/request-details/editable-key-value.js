export default {

  emits: [
    'update:modelValue'
  ],

  props: [
    'modelValue',
  ],

  data() {
    return {
      items: Object.entries({ ...this.modelValue }).reduce( (acc, [key, value]) => {
        return [
          ...acc,
          {
            key,
            value,
            enabled: true,
          },
        ]
      }, [])
    }
  },

  methods: {
    test() {
      this.$emit('update:modelValue', { a: 1})
    },
  },

  template: `
    <v-table style="user-select: text;">
      <tbody>
        <tr
          v-for="item in items"
          :key="item.key"

          :style="{ opacity: item.enabled ? 1 : 0.5, }"
        >
          <td>
            <v-icon icon="mdi-drag-vertical" />
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
        </tr>
      </tbody>
    </v-table>
  `
}
