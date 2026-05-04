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
    }
  },

  methods: {
    async handleRequest(options) {
      this.result = await window.electron.http(Vue.toRaw(options))
    }
  },

  template: `
    <request @send="handleRequest" />

    <response :result />
  `
}
