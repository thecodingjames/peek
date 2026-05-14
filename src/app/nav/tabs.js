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
    }
  },

  methods: {

    handleRename(id) {
      
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

    {{ current }}
    <v-tabs 
      show-arrows
      hide-slider
      v-model="current"
      :items="tabs"
    >
      <template v-slot:tab="{ item }">
        <v-tab
          @dblclick="handleRename(id)"
          :key="item.id"
          :text="item.title"
          :value="item.id"
        >
          <template v-slot:append>
            <v-btn
              v-if="tabs.length > 1"
              @click.prevent="handleClose(item.id)"
              color="error"
              icon="mdi-close"
              size="small"
              variant="plain"
            ></v-btn>
          </template>
        </v-tab>
      </template>

      <template v-slot:item="{ item }">
          
        <v-tabs-window-item :key="item.id" :value="item.id" class="pa-4">
          <http-page />
        </v-tabs-window-item>
      </template>
    </v-tabs>
  `
}
