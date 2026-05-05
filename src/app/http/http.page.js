import Request from './request.js'
import Response from './response.js'

export default {
  components: {
    Request,
    Response,
  },

  data() {
    return {
      result: undefined,
      options: undefined,
    }
  },

  methods: {
    async handleRequest(request) {
      const options = { method: request.method, url: request.fullUrl.toString() }
      try {
        const result = await window.electron.http(options)

        this.result = result
        this.options = options
      } catch (e) {
        console.log(e.message)
      }
    }
  },

  template: `
    <request @send="handleRequest" />

    <response :options :result />
  `
}
