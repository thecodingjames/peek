import Request from './request.js'
import Response from './response.js'
import http from './http.service.js'
import ResponseModel from './response.model.js'

export default {
  components: {
    Request,
    Response,
  },

  data() {
    return {
      response: undefined,
    }
  },

  methods: {
    async handleRequest(request) {
      try {
        this.response = ResponseModel.instantiate(await http(request))
      } catch (e) {
        console.log(e.message)
      }
    }
  },

  template: `
    <component is="style">
      .http_http-page {
        display: flex;
        gap: 2rem;
        flex-direction: column;
      }
    </component>

    <div class="http_http-page">
      <request @send="handleRequest" />

      <response :response />
    </div>
  `
}
