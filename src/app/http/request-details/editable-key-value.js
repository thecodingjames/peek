export default {

  emits: [
    'update:modelValue'
  ],

  props: [
    'modelValue',
  ],

  methods: {
    test() {
      this.$emit('update:modelValue', { a: 1})
    },
  },

  template: `
    <v-table striped="even" style="user-select: text;">
      <tbody>
        <tr
          v-for="(value, key) in modelValue"
          :key
        >
          <td style="user-select: text; cursor: text; white-space: nowrap;">{{ key }}</td>
          <td style="user-select: text; cursor: text;">{{ value }}</td>
        </tr>
      </tbody>
    </v-table>
  `
}
