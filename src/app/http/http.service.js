import SettingsService from '../drawers/settings/settings.service.js'
import ResponseModel from './response.model.js'

import HistoryService from '../drawers/history/history.service.js'

export default async function http(request) {
  const redirect = SettingsService.http.followRedirect ? 'follow' : 'manual'

  const start = Date.now()

  const { error, ...result } = await window.electron.http({
    ...request.toJSON(),
    redirect,
  })

  HistoryService.add(
    request, 
    { 
      ...result, 
      duration: (Date.now() - start),
    }
  )

  if (error) {
    throw new Error(error)
  } else {
    return result
  }
}
