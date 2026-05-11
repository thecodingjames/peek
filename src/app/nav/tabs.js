import HttpPage from '../http/http.page.js'

export default {
  components: {
    HttpPage
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
      show-arrows
      hide-slider
      :items="[1, 2, 3]"
    >
      <template v-slot:tab="{ item }">
        <v-tab
          @dblclick="console.log('a')"
          :key="item.text"
          :text="item.text"
          :value="item.text"
        >
          <template v-slot:append>
            <v-btn
              color="error"
              icon="mdi-close"
              size="small"
              variant="plain"
            ></v-btn>
          </template>
        </v-tab>
      </template>

      <template v-slot:item="{ item }">
        <v-tabs-window-item :value="item.value" class="pa-4">
          <http-page />
        </v-tabs-window-item>
      </template>
    </v-tabs>
  `
}
