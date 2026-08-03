import { raw } from '../core/helpers.js'
import SettingsService from '../drawers/settings/settings.service.js'
import ResponseModel from './response.model.js'

import HistoryService from '../drawers/history/history.service.js'

export default class Http {

  #current = null

  async execute(request) {
    const requestId = crypto.randomUUID()
    this.#current = requestId

    const redirect = SettingsService.http.followRedirect ? 'follow' : 'manual'

    const start = Date.now()

    const options = await request.fetchOptions

    const { error, ...result } = await window.electron.http(raw({
      ...options,
      redirect,
    }))

    debugger

    if (this.#current === null) {
      // cancelled
      return { }
    } else if (this.#current != requestId) {
      // new request replaced existing
      return null
    } else {
      // completed
      let response = null
      if (Object.keys(result).length > 0) {
        response = {
          ...result,
          duration: (Date.now() - start),
        }
      }

      HistoryService.add(
        request,
        response
      )

      if (error) {
        throw new Error(error)
      } else {
        return response
      }
    }
  }

  cancel() {
    this.#current = null
  }
}
