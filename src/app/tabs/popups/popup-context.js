import Popup, { mixin } from './popup.js'
import RenameForm from './rename-form.js'

export default {
  mixins: [
    mixin,
  ],

  components: {
    Popup,
    RenameForm,
  },

  template: `
    <Popup :context >
      <v-list>

        <v-list-item link>
          <v-list-item-title>Duplicate</v-list-item-title>
        </v-list-item>

        <v-list-item link>
          <v-list-item-title>Close</v-list-item-title>
        </v-list-item>

        <v-list-item link>
          <v-list-item-title>Close Others</v-list-item-title>
        </v-list-item>

        <v-list-item link>
          <v-list-item-title>Close All</v-list-item-title>
        </v-list-item>

        <v-list-subheader>Rename</v-list-subheader>

        <v-list-item>
          <RenameForm
            :title="context.title"

            @submit="handleRename"
          />
        </v-list-item>

      </v-list>
    </Popup>
  `
}
