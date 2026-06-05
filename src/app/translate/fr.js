export default {

  drawers: {
    newRequest: {
      title: 'Nouvelle requête',
    },

    history: {
      title: 'Historique',
      empty: 'Aucunes requêtes...',
    },

    settings: {
      title: 'Configuration',
      followRedirect: 'Suivre les redirections',
      appearance: 'Visuel',
      alwaysShowTabs: 'Toujours afficher les onglets',
      theme: 'Thème',
      system: 'Système',
      light: 'Clair',
      dark: 'Sombre',
      language: 'Langue',
      keyBindings: 'Raccourcis clavier',
    },
  },

  tabs: {
    defaultRequestName: 'Requête',
    newRequest: 'Nouvelle requête',
  },

  hotkeys: {
    dialog: {
      title: 'Raccourcis clavier',
    },

    nav: {
      title: 'Navigation',

      hotkeys: {
        title: 'Raccourcis clavier',
      },

      history: {
        title: 'Historique',
      },

      settings: {
        title: 'Configuration',
      },
    },

    tabs: {
      title: 'Onglets',

      new: {
        title: 'Nouvel onglet'
      },

      close: {
        title: 'Fermer l\'onglet courant'
      },

      next: {
        title: 'Naviguer à l\'onglet suivant'
      },

      previous: {
        title: 'Naviguer à l\'onglet précédant'
      },

    },

    request: {
      title: 'Requête',

      url: {
        title: 'Accéder au champs URL'
      },

      method: {
        title: 'Personnaliser le verbe HTTP'
      },

    },

  },

  request: {
    title: 'Requête',
    rawHttp: 'HTTP brut',

    details: {
      query: {
        name: 'paramètres',
      },

      body: {
        name: 'corps',
      },

      headers: {
        name: 'en-têtes',
      },
    },

    model: {
      invalidPath: 'CHEMIN INVALIDE',
      invalidHost: 'HÔTE INVALIDE',

      validations: {
        method: 'La méthode doit être parmis',
        url: 'URL obligatoire',
      },
    },
  },

  response: {
    title: 'Réponse',
    pending: 'En attente d\'une requête...',
    error: 'Hôte distant inaccessible',

    tabs: {
      raw: {
        redirected: 'redirigé',
      },

      headers: {
        title: 'En-têtes',
      },

      preview: {
        title: 'Aperçu',
      },
    },

    model: {
      validations: {
        url: 'URL est obligatoire',
        code: 'Le code doit être une entier de 0 à 599',
        status: 'Le status est obligatoire',
        headers: 'En-tête doit être un objet',
        redirected: 'Redirigé doit être un booléen',
      },
    },

  },

}
