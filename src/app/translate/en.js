export default {

  save: 'Save',

  panels: {
    newRequest: {
      title: 'New request',
    },

    history: {
      title: 'History',
    },

    settings: {
      title: 'Settings',
      followRedirect: 'Follow redirects',
      appearance: 'Appearance',
      theme: 'Theme',
      system: 'System',
      light: 'Light',
      dark: 'Dark',
      language: 'Language',
      keyBindings: 'Key-bindings',
    },
  },

  tabs: {
    defaultRequestName: 'Requête',
    newRequest: 'Nouvelle requête',
  },

  request: {
    title: 'Request',
    rawHttp: 'Raw HTTP',

    model: {
      invalidPath: 'INVALID PATH',
      invalidHost: 'INVALID HOST',

      validations: {
        method: 'Method must be one of',
        url: 'URL is required',
      },
    },
  },

  response: {
    title: 'Response',
    pending: 'Waiting for request...',

    tabs: {
      raw: {
        redirected: 'redirected',
      },

      headers: {
        title: 'Headers',
      },

      preview: {
        title: 'Preview',
      },
    },

    model: {
      validations: {
        url: 'Url is required',
        code: 'Code must be an integer between 100 and 599',
        status: 'Status is required',
        headers: 'Headers must be an object',
        redirected: 'Redirected must be a boolean',
      },
    },

  },
}
