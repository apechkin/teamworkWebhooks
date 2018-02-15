const nodemailer = require('nodemailer');
const config = require('../config');
const transport = nodemailer.createTransport({
  host: config.host,
  port: config.smtpPort,
  secure: config.secure,
  debug: config.debug
});

function Mailer() {
  this._notify = (email, message) => {
    return new Promise((resolve, reject) => {
      let options = {
        to: `${email}`,
        from: 'your@email.address',
        subject: 'your subject',
        html: `Your text: ${message}`
      };
      return transport.sendMail(options, (err, info) => {
        if(err) {
          reject(err);
        } else {
          transport.close();
          resolve(true);
        }
      });
    });
  }
};

const mailer = new Mailer()
module.exports = mailer;
