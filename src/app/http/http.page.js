import Request from '/app/http/request.js'
import Response from '/app/http/response.js'

export default {
  components: {
    Request,
    Response,
  },
  template: `
    <component is="style">
      .http-card .v-card-subtitle {
        font-weight: bold !important;
        text-align: start;
        text-transform: uppercase;
        font-size: 0.8rem;
      }
    </component>


    <h1>HTTP Page</h1>

    <request />

    <response />
  `
}
