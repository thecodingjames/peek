import Request from './request/request.js'
import Response from './response.js'
import HttpService from './http.service.js'
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
        const result = await this.http.execute(request)

        if (result?.code) {
          this.response = ResponseModel.instantiate(result)
        }
      } catch (e) {
        this.response = null

        if (this.app.development) {
          console.error(e)
        }
      } finally {
        this.$refs.request.done()
      }
    },

    handleCancelRequest() {
      this.http.cancel()
    },

  },

  created() {
    this.http = new HttpService()
  },

  template: `
    <component is="style">
      .http_http-page {
        height: 100%;

        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;
        grid-template-rows: repeat(2, 1fr);

        .section-title {
          font-weight: bold !important;
          text-align: start;
          text-transform: uppercase;
          font-size: 0.8rem;
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
      <request
        ref="request"
        :tabId

        @send="handleRequest"
        @cancel="handleCancelRequest"
      />

      <response
        :tabId

        :response
      />
    </div>
  `
}
