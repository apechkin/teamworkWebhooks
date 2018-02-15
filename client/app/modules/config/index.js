module.exports = {
  host: process.env.NODE_SMTP_SERVER || 'smtp_server',
  smtpPort: process.env.NODE_SMTP_PORT || 25,
  secure: process.env.NODE_SMTP_SECURE || false,
  debug: process.env.NODE_SMTP_DEBUG || false,
  supportEmail: process.env.NODE_SUPPORT_EMAIL || 'support@email.net',
  q: process.env.NODE_QUEUE || 'your_queue_name',
  callbackQ: process.env.NODE_QUEUE_CALLBACK || 'your_queue_callback',
  uri: process.env.NODE_QUEUE_SERVER || 'amqp://localhost',
  company: process.env.NODE_TEAMWORK_SITE || 'teamwork_domain',
  key: process.env.NODE_TEAMWORK_KEY || 'teamwork_api_key',
  port: process.env.PORT || 3000
};
