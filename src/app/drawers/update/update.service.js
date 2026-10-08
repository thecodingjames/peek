const KEY = 'lastUpdateCheck'

const updateAvailable = Vue.ref(false)

const service = {
  updateAvailable,

  get latestReleaseUrl() {
    return 'https://github.com/thecodingjames/peek/releases/latest'
  },

  async check(force = false) {
    const loadedLastUpdateCheck = new Date(localStorage.getItem(KEY))
    const now = new Date()

    const daysDiff = (now - loadedLastUpdateCheck) / (1000 * 60 * 60 * 24)

    if (force || daysDiff >= 1) {
      try {
        const response = await fetch(this.latestReleaseUrl)
        const [ _, serverVersion ] = response.url.match(/tag\/v(.+)$/) ?? []

        const { version: localVersion } = await electron.app()

        const [ local, server ] = [ localVersion, serverVersion ].map( version => {
          return version.split('.').map( part => part.padStart(4, '0') ).join('.')
        })

        updateAvailable.value = (local < server)

        localStorage.setItem(KEY, now.toJSON())

        return updateAvailable.value
      } catch(e) {
        console.error('Update check failed', e)
      }
    }
  }
};

service.check()

export default service
