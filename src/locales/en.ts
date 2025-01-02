export default {
  direction: 'ltr' as const,
  magicLink: {
    title: 'Login to {{appName}}:',
    alternative: 'Or copy this link:',
    expiry: 'Expires in {{minutes}} minutes',
    securityTip: 'Do not share this link',
    context: {
      location: 'Location: {{location}}',
      device: 'Device: {{device}}',
      lastLogin: 'Last login: {{lastLogin}}',
      requestSource: 'Request from: {{requestSource}}'
    }
  }
} as const;
