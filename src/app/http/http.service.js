import SettingsService from '../nav/drawers/settings.service.js'
import ResponseModel from './response.model.js'

export default async function http(request) {
  const redirect = SettingsService.http.followRedirect ? 'follow' : 'manual'

  const { error, ...result } = await window.electron.http({
    ...request.fetchInit,
    redirect
  })

  if (error) {
    throw new Error(error)
  } else {
    return result
  }
}
