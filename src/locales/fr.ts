export default {
  direction: 'ltr' as const,
  magicLink: {
    title: 'Cliquez sur ce lien pour vous connecter à {{appName}} :',
    alternative: 'Ou copiez et collez ce lien dans votre navigateur :',
    expiry: 'Ce lien expirera dans {{minutes}} minutes.',
    securityTip: 'Ne partagez pas ce lien',
    context: {
      location: 'Emplacement : {{location}}',
      device: 'Appareil : {{device}}',
      lastLogin: 'Dernière connexion : {{lastLogin}}',
      requestSource: 'Demande depuis : {{requestSource}}'
    }
  }
} as const;
