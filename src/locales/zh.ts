export default {
  direction: 'ltr' as const,
  magicLink: {
    title: '登录到{{appName}}:',
    alternative: '或复制此链接:',
    expiry: '{{minutes}}分钟后过期',
    securityTip: '请勿分享此链接',
    context: {
      location: '位置: {{location}}',
      device: '设备: {{device}}',
      lastLogin: '上次登录: {{lastLogin}}',
      requestSource: '请求来源: {{requestSource}}'
    }
  }
} as const;
