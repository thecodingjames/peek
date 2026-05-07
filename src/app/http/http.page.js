import Request from './request.js'
import Response from './response.js'
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
        const result = await window.electron.http({ ...request.fetchInit })

        this.response = ResponseModel.instantiate(result)
      } catch (e) {
        console.log(e.message)
      }
    }
  },

  template: `
    <request @send="handleRequest" />

    <response :response />
  `
}
