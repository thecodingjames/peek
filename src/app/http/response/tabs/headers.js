export default {

  props: [ 'headers' ],

  template: `
    <div class="._http_response_tabs_headers" >
      <component is="style">
        ._http_response_tabs_headers {
          .v-table__wrapper {
            overflow: hidden;
          }
        }
      </component>

      <v-table
        striped="even"
        class="border-b-sm"
        style="user-select: text;"
      >
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
    </div>
  `
}
