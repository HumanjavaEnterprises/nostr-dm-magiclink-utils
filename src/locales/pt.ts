export default {
  direction: 'ltr' as const,
  magicLink: {
    title: 'Entrar no {{appName}}:',
    alternative: 'Ou copie este link:',
    expiry: 'Expira em {{minutes}} minutos',
    securityTip: 'Não compartilhe este link',
    context: {
      location: 'Localização: {{location}}',
      device: 'Dispositivo: {{device}}',
      lastLogin: 'Último acesso: {{lastLogin}}',
      requestSource: 'Solicitado de: {{requestSource}}'
    }
  }
} as const;
