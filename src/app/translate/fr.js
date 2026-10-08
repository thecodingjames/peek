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

      request: 'Requête',
      followRedirect: 'Suivre les redirections',

      response: 'Réponse',
      bodyWrapText: 'Corps retour à la ligne automatique',
      previewWrapText: 'Aperçu retour à la ligne automatique',
      previewAllowScripts: 'Autoriser JavaScript dans l\'aperçu',

      appearance: 'Visuel',
      alwaysShowTabs: 'Toujours afficher les onglets',
      theme: 'Thème',
      system: 'Système',
      light: 'Clair',
      dark: 'Sombre',
      language: 'Langue',
      keyBindings: 'Raccourcis clavier',

      updates: {
        checkForUpdates: 'Vérifier les mises à jour',
        checkNow: 'Vérifier maintenant',

        dialog: {
          title: 'Mises à jour',
          checking: 'Vérification des mises à jour',
          openDownload: 'Ouvrir la page de téléchargement',
          updateAvailable: 'Mise à jour disponible.',
          upToDate: 'Dernière version déjà installée.',
          error: 'Impossible de vérifier les mise à jour...',
          close: 'Fermer',
        },
      }
    },

    update: {
      title: 'Récupérer la dernière mise à jour',
    },
  },

  tabs: {
    defaultRequestName: 'Requête',
    newRequest: 'Nouvelle requête',
    context: {
      duplicate: 'Dupliquer',
      closeOthers: 'Fermer les autres',
      closeAll: 'Fermer tous',
    },
    rename: 'Renommer',
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

      rename: {
        title: 'Renommer l\'onglet courant'
      },

      close: {
        title: 'Fermer l\'onglet courant'
      },

      ['close-all']: {
        title: 'Fermer tous les onglets'
      },

      ['close-others']: {
        title: 'Fermer les autres onglets'
      },

      duplicate: {
        title: 'Dupliquer l\'onglet courant'
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
      keyValue: {
        empty: 'Aucuns items...',
        fileValueLabel: 'Fichier...',
        save: 'Sauvegarder',
      },

      query: {
        name: 'paramètres',
      },

      body: {
        name: 'corps',
        raw: 'Texte brut',
        keyValue: 'Paires clé-valeur',
      },

      headers: {
        name: 'en-têtes',
      },
    },

    model: {
      invalidPath: 'CHEMIN INVALIDE',
      invalidHost: 'HÔTE INVALIDE',
      preventBody: 'AUCUN CORPS AVEC GET/HEAD',

      validations: {
        method: 'La méthode doit être parmis',
        url: 'URL obligatoire',
      },
    },
  },

  response: {
    title: 'Réponse',
    pending: 'En attente d\'une requête...',
    error: {
      unknown: 'Requête ou réponse invalide...',
      host: 'Hôte inaccessible',
      status: 'Code HTTP de la réponse invalide',
    },

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
