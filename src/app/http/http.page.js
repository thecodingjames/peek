import Request from '/app/http/request.js'
import Response from '/app/http/response.js'

export default {
  components: {
    Request,
    Response,
  },
  template: `
    <request />

    <response />
  `
}
