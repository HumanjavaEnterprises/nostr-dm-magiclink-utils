export default {
  direction: 'ltr' as const,
  magicLink: {
    title: 'Haz clic en este enlace para iniciar sesión en {{appName}}:',
    alternative: 'O copia y pega este enlace en tu navegador:',
    expiry: 'Este enlace caducará en {{minutes}} minutos.',
    securityTip: 'No compartas este enlace',
    context: {
      location: 'Ubicación: {{location}}',
      device: 'Dispositivo: {{device}}',
      lastLogin: 'Último acceso: {{lastLogin}}',
      requestSource: 'Solicitud desde: {{requestSource}}'
    }
  }
} as const;
