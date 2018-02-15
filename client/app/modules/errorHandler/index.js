const mailer = require('../mailer');
const config = require('../config');
const errorHandler = (err, req, res, next) => {
  /*
    Send message to support email address
   */
  return mailer._notify(config.supportEmail, `Catch error: ${ (typeof err === 'object') ? JSON.stringify(err) : err }`)
  .then(() => {
    res.status(err.status || 500);
    res.json({
      error: err,
    });
  })
  .catch((mailerErr) => {
    res.status(err.status || 500);
    res.json({
      error: err,
      mailerErr: mailerErr
    });
  });
}

module.exports = errorHandler;
