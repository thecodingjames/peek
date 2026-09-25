export default {

  props: [ 'headers' ],

  template: `
    <v-table striped="even" style="user-select: text;">
      <tbody>
        <tr
          v-for="(value, name) in headers"
          :key="name"
        >
          <td style="user-select: text; cursor: text; white-space: nowrap;">{{ name }}</td>
          <td style="user-select: text; cursor: text; word-wrap: anywhere;">{{ value }}</td>
        </tr>
      </tbody>
    </v-table>
  `
}
