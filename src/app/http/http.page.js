import Request from './request.js'
import Response from './response.js'
import http from './http.service.js'
import ResponseModel from './response.model.js'

import TabMixin from '../tabs/tab.mixin.js'

export default {
  mixins: [
    TabMixin,
  ],

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
        this.response = ResponseModel.instantiate(await http(Vue.toRaw(request)))
      } catch (e) {
        this.response = null

        if (this.app.development) {
          console.error(e)
        }
      }
    }
  },

  template: `
    <component is="style">
      .http_http-page {
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(2, 1fr);

        .section-title {
          font-weight: bold !important;
          text-align: start;
          text-transform: uppercase;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          letter-spacing: 0.03rem;
        }
      }

      @media (min-width: 960px) {
        .http_http-page {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-template-rows: 1fr;
        }
      }
    </component>

    <div class="http_http-page">
      <request @send="handleRequest" :tabId />

      <response :response :tabId />
    </div>
  `
}
