export default {

  drawers: {
    newRequest: {
      title: 'New request',
    },

    history: {
      title: 'History',
      empty: 'No requests...',
    },

    settings: {
      title: 'Settings',
      followRedirect: 'Follow redirects',
      alwaysShowTabs: 'Always show tabs',
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
    defaultRequestName: 'Request',
    newRequest: 'New request',
  },

  hotkeys: {
    dialog: {
      title: 'Key-bindings',
    },

    nav: {
      title: 'Navigation',

      hotkeys: {
        title: 'Key-bindings',
      },

      history: {
        title: 'History',
      },

      settings: {
        title: 'Settings',
      },
    },

    tabs: {
      title: 'Tabs',

      new: {
        title: 'New tab'
      },

      close: {
        title: 'Close current tab'
      },

      next: {
        title: 'Go to next tab'
      },

      previous: {
        title: 'Go to previous tab'
      },

    },

    request: {
      title: 'Request',

      url: {
        title: 'Focus URL input'
      },

      method: {
        title: 'Customize HTTP verb'
      },

    },

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
    error: 'Remote host unavailable',

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
