import SettingsService from './settings.service.js'

export default {
  
  data() {
    return {
      SettingsService,
    }
  },

  template: `
    <h1>Settings</h1>

    <h2>HTTP</h2>

    <v-switch 
      v-model="SettingsService.http.followRedirect" 
      label="Follow redirect"
      color="primary"
    ></v-switch>

    <h2>UI</h2>

    <v-select
      v-model="SettingsService.ui.theme"
      :items="['system', 'light', 'dark']"
      label="Theme"
    ></v-select>

    <v-switch 
      label="Default to preview"
      color="primary"
    ></v-switch>
  `
}
