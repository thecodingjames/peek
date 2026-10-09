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

      request: 'Request',
      followRedirect: 'Follow redirects',

      response: 'Response',
      bodyWrapText: 'Body text-wrap',
      previewWrapText: 'Preview text-wrap',
      previewAllowScripts: 'Allow JavaScript in preview',

      alwaysShowTabs: 'Always show tabs',
      appearance: 'Appearance',
      theme: 'Theme',
      system: 'System',
      light: 'Light',
      dark: 'Dark',
      language: 'Language',
      keyBindings: 'Key-bindings',

      updates: {
        checkForUpdates: 'Check for updates',
        checkNow: 'Check now',

        dialog: {
          title: 'Updates',
          checking: 'Checking for updates',
          openDownload: 'Open download page',
          updateAvailable: 'Update available.',
          upToDate: 'Latest version already installed.',
          error: 'Could not check for updates...',
          close: 'Close',
        },
      },
    },

    update: {
      title: 'Get latest update',
    },
  },

  tabs: {
    defaultRequestName: 'Request',
    newRequest: 'New request',
    context: {
      duplicate: 'Duplicate',
      closeOthers: 'Close others',
      closeAll: 'Close all',
    },
    rename: 'Rename',
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

      rename: {
        title: 'Rename current tab'
      },

      close: {
        title: 'Close current tab'
      },

      ['close-all']: {
        title: 'Close all tabs'
      },

      ['close-others']: {
        title: 'Close other tabs'
      },

      duplicate: {
        title: 'Duplicate current tab'
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

    details: {
      keyValue: {
        empty: 'No items...',
        fileValueLabel: 'File...',
        save: 'Save',
      },

      query: {
        name: 'query',
      },

      body: {
        name: 'body',
        raw: 'Raw text',
        keyValue: 'Key-Value pairs',
      },

      headers: {
        name: 'headers',
      },
    },

    model: {
      invalidPath: 'INVALID PATH',
      invalidHost: 'INVALID HOST',
      preventBody: 'NO BODY SENT FOR GET/HEAD',

      validations: {
        method: 'Method must be one of',
        url: 'URL is required',
      },
    },
  },

  response: {
    title: 'Response',
    pending: 'Waiting for request...',
    error: {
      unknown: 'Invalid request or response...',
      host: 'Host unreachable',
      connection: 'Service unavailable for specified port',
      status: 'Invalid response status code',
    },

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
