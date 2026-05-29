import t from '../../translate/translate.service.js'

import RequestModel from '../../http/request.model.js'

export default class HistoryModel extends RequestModel {

  constructor(request, result) {
    super(request)

    if (!result || typeof(result) != 'object' || Object.keys(result).length == 0) {
      // Http error, no response
      this.response = null
    } else {
      const { code, redirected, duration } = result

      this.response = {
        code,
        redirected, 
        duration,
      }
    }
  }

  get formattedDuration() {
    return `${this.response?.duration ?? 'N/A'}ms`
  }

  toJSON() {
    return {
      ...super.toJSON(),

      response: this.response,
    }
  }

}
