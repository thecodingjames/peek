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

      renaming: null,
      showRenamingPopup: false,
    }
  },

  methods: {

    handleSelect(id) {
      TabsService.select(id)
    },

    handleRenamePopup(event, tabId) {
      const {id, title} = TabsService.get(tabId)

      this.renaming = {
        element: event.currentTarget,
        id,
        title,
      }

      this.showRenamingPopup = true

      Vue.nextTick(() => {
        setTimeout(() => {
          this.$refs.renameInput.controlRef.focus()
        }, 200)
      })
    },

    handleRenameSubmit() {
      this.showRenamingPopup = false
      const { id, title } = this.renaming

      TabsService.rename(id, title)
    },

    handleClose(id) {
      TabsService.remove(id)
    },

  },

  mounted() {
    this.$refs.renamePopup.animateClick = () => {
      this.renaming = null
    }
  },

  template: `
    <component is="style">
      .nav_tabs.v-tabs {
        border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

        .v-tab--selected {
          --opacity: calc(var(--v-activated-opacity) * var(--v-high-emphasis-opacity));
          background-color: color-mix(in srgb, currentColor calc(var(--opacity) * 100%), transparent);
        }

      }

      .nav_tabs .v-field__input {
        padding: 0 0 0 0.5rem;
      }
    </component>

    <v-tabs 
      v-if="tabs.length > 1"
      show-arrows
      hide-slide

      :model-value="current"
      @update:model-value="handleSelect"

      class="nav_tabs"
    >
      <v-tab
        v-for="item in tabs"
        :key="item.id"

        :text="item.title"
        :value="item.id"

        @dblclick="handleRenamePopup($event, item.id)"
      >

        <template v-slot:append>
          <v-btn
            @click.prevent="handleClose(item.id)"
            color="error"
            size="x-small"
            variant="outlined"
            style="min-width: 0; aspect-ratio: 1;"
          >ㄨ</v-btn>
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

    <v-menu
      ref="renamePopup"

      :model-value="showRenamingPopup"
      @update:model-value="showRenamingPopup = false"

      :target="renaming?.element"
      :close-on-content-click="false"
      location="bottom"
    >
      <v-card class="nav_tabs" min-width="300">
        <form 
          @submit.prevent="handleRenameSubmit()"
          style="display: flex; align-items: center;"
        >
          <v-text-field
            ref="renameInput"

            :model-value="renaming?.title"
            @update:model-value="renaming ? (renaming.title = $event) : 'no-op'"

            placeholder="Title"

            :hide-details="true"
            density="comfortable"
            variant="plain"
            tile
          />

          <v-btn
            type="submit"
            color="primary"
            variant="text"
            text="Save"
          />
        </form>
      </v-card>
    </v-menu>
  `
}
