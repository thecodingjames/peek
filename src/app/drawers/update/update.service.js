const KEY = 'lastUpdateCheck'

const updateAvailable = Vue.ref(false)

export default {
  updateAvailable,
};

(async () => {
  const loadedLastUpdateCheck = new Date(localStorage.getItem(KEY))
  const now = new Date()

  const daysDiff = (now - loadedLastUpdateCheck) / (1000 * 60 * 60 * 24)

  if (daysDiff >= 1) {
  }


  try {
    const response = await fetch('https://github.com/thecodingjames/peek/releases/latest')
    const [ _, serverVersion ] = response.url.match(/tag\/v(.+)$/) ?? []

    const { version: localVersion } = await electron.app()

    const [ local, server ] = [ localVersion, serverVersion ].map( version => {
      return version.split('.').map( part => part.padStart(4, '0') ).join('.')
    })

    updateAvailable.value = (local < server)
  } catch { }

})();
