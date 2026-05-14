import TabsService from './tabs.service.js'
import HttpPage from '../http/http.page.js'

export default {
  components: {
    HttpPage
  },

  data() {
    return {
      current: TabsService.current,
      tabs: TabsService.tabs,

      renamingTab: null,
      showDialog: false,
    }
  },

  methods: {

    handleSelect(id) {
      TabsService.select(id)
    },

    handleRename(event, id) {
      event.preventDefault()

      this.renamingTab = TabsService.get(id)
      this.showDialog = true
    },

    handleClose(id) {
      TabsService.remove(id)
    },

  },

  template: `
    <component is="style">
      .v-tabs {
        border-bottom: 1px solid gray;
      }

      .v-tab--selected {
        background-color: lightgray;
      }
    </component>

    <v-tabs 
      v-if="tabs.length > 1"
      show-arrows
      hide-slider

      :model-value="current"
      @update:model-value="handleSelect"
    >
        <v-tab
          v-for="item in tabs"
          :key="item.id"

          :text="item.title"
          :value="item.id"

          @dblclick="handleRename($event, item.id)"
        >
          <template v-slot:append>
            <v-btn
              @click.prevent="handleClose(item.id)"
              color="error"
              icon="mdi-close"
              size="small"
              variant="plain"
            ></v-btn>
          </template>
        </v-tab>
    </v-tabs>

    <v-window v-model="current">
      <v-tabs-window-item 
        v-for="item in tabs"
        :key="item.id" 
        :value="item.id"
        style="padding: 1rem;"
      >
        <http-page />
      </v-tabs-window-item>
    </v-window>

   <v-dialog v-model="showDialog">
      <v-card>
        <v-card-text>
          <v-row density="comfortable">
            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
                label="First name*"
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
                hint="example of helper text only on focus"
                label="Middle name"
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
                hint="example of persistent helper text"
                label="Last name*"
                persistent-hint
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
                label="Email*"
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
                label="Password*"
                type="password"
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              md="4"
              sm="6"
            >
              <v-text-field
                label="Confirm Password*"
                type="password"
                required
              ></v-text-field>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-select
                :items="['0-17', '18-29', '30-54', '54+']"
                label="Age*"
                required
              ></v-select>
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-autocomplete
                :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                label="Interests"
                auto-select-first
                multiple
              ></v-autocomplete>
            </v-col>
          </v-row>

          <small class="text-body-small text-medium-emphasis">*indicates required field</small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Close"
            variant="plain"
            @click="dialog = false"
          ></v-btn>

          <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="dialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  `
}
