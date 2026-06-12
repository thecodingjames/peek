import { raw } from '../core/helpers.js'
import SettingsService from '../drawers/settings/settings.service.js'
import ResponseModel from './response.model.js'

import HistoryService from '../drawers/history/history.service.js'

export default async function http(request) {
  const redirect = SettingsService.http.followRedirect ? 'follow' : 'manual'

  const start = Date.now()

  const options = await request.fetchOptions

  const { error, ...result } = await window.electron.http(raw({
    ...options,
    redirect,
  }))


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
