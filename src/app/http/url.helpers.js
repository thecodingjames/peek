export function parseUrl(url) {
  if (! url?.match(/^https?:\/\/.+/) ) {
    url = `http://${url}`
  }

  try {
    return new URL(url)
  } catch {
    return null
  }
}
