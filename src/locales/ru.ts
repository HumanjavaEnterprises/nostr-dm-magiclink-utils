export default {
  direction: 'ltr' as const,
  magicLink: {
    title: 'Вход в {{appName}}:',
    alternative: 'Или скопируйте эту ссылку:',
    expiry: 'Истекает через {{minutes}} минут',
    securityTip: 'Не делитесь этой ссылкой',
    context: {
      location: 'Местоположение: {{location}}',
      device: 'Устройство: {{device}}',
      lastLogin: 'Последний вход: {{lastLogin}}',
      requestSource: 'Источник запроса: {{requestSource}}'
    }
  }
} as const;