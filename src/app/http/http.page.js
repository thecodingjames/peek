import Request from '/app/http/request.js'
import Response from '/app/http/response.js'

export default {
  components: {
    Request,
    Response,
  },
  template: `


    <h1>HTTP Page</h1>

    <request />

    <response />
  `
}
