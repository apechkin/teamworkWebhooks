module.exports = {
  host: process.env.NODE_SMTP_SERVER || 'smtpServer',
  port: process.env.NODE_SMTP_PORT || 'smtpPort',
  secure: process.env.NODE_SMTP_SECURE || true,
  debug: process.env.NODE_SMTP_DEBUG || true
};
