export default {
  direction: 'rtl' as const,
  magicLink: {
    title: 'تسجيل الدخول إلى {{appName}}:',
    alternative: 'أو انسخ هذا الرابط:',
    expiry: 'تنتهي الصلاحية خلال {{minutes}} دقيقة',
    securityTip: 'لا تشارك هذا الرابط',
    deviceInfo: '{{browser}} على {{os}}',
    location: '{{city}}، {{country}}',
    footer: '{{appName}} {{year}}'
  }
} as const;
