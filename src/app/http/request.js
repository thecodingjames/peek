export default {
  template: `
    <v-card
      subtitle="request"
      variant="text"
      class="http-card"
    >

      <v-autocomplete
        :items="['GET', 'POST']"
        item-title="name"
        label="Method"
        :auto-select-first="true"
        :clearable="true"
        variant="outlined"
      />

      <v-text-field
        label="URL"
        required
        variant="outlined"
      />
      
      <v-expansion-panels>
        <v-expansion-panel
          title="RAW"
          :static="true"
        >
          <v-expansion-panel-text>
            <p>...</p>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  `
}
