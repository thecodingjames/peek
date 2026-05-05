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
      try {
        this.result = await window.electron.http(Vue.toRaw(options))
      } catch (e) {
        alert(e.message)
      }
    }
  },

  template: `
    <request @send="handleRequest" />

    <response :result />
  `
}
