const nodemailer = require('nodemailer');
const smtpConfig = require('./config');
const transport = nodemailer.createTransport(smtpConfig);
const supportEmail = process.env.NODE_SUPPORT_EMAIL;

function Mailer() {
  this._notify = (errorMessage, type) => {
    let parsedMessage = '';
    switch (type) {
      case 'json':
        parsedMessage = JSON.stringify(errorMessage);
        break;
      case 'text':
        parsedMessage = errorMessage;
        break;
    }
    return new Promise((resolve, reject) => {
      let message = {
        to: `${supportEmail}`,
        from: 'fake@email.address',
        subject: 'your subject',
        html: `Your text: ${parsedMessage}`
      };
      return transport.sendMail(message, (err, info) => {
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
