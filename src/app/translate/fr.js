export default {

  save: 'Sauvegarder',

  panels: {
    newRequest: {
      title: 'Nouvelle requête',
    },

    history: {
      title: 'Historique',
    },

    settings: {
      title: 'Configuration',
      followRedirect: 'Suivre les redirections',
      appearance: 'Visuel',
      theme: 'Thème',
      system: 'Système',
      light: 'Clair',
      dark: 'Sombre',
      language: 'Langue',
    },
  },

  tabs: {
    defaultRequestName: 'Requête',
    newRequest: 'Nouvelle requête',
  },

  request: {
    title: 'Requête',
    rawHttp: 'HTTP brut',

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
