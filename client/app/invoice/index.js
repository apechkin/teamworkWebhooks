const rabbitHelper = require('../modules/rabbitHelper');
const teamworkHelper = require('../modules/teamworkHelper');
const mailer = require('../modules/mailer');
const config = require('../modules/config');

const sendToQueue = async (message) => {
  try {
    let client = await rabbitHelper._connect();
    let channel = await rabbitHelper._channel(client);
    let result = await rabbitHelper._awaitMessage(channel, message);
    console.log(' [.] Got: ', result);
    await rabbitHelper._closeConnection(client);
  } catch (err) {
    throw err;
  }
};

const validateEmail = (email) => {
  let regExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regExp.test(email);
}

const validateInvoice = (message) => {
  let regExp =  /[A-Z]-[A-Z]\d{2}-[A-Z]{2}-\d{3}-\d{2}/gi;
  if (message.length === 15) {
    return regExp.test(message);
  } else {
    return null;
  }
}

const completed = async (req, res, next) => {
  try {
    let data = Object.assign({}, req.body, {action: 'invoice.completed'})
    if (typeof req.body.invoice !== 'undefined' && validateInvoice(req.body.invoice.number)) {
      /*
        Get invoice id from webhook, parse information about it and send message in queue
       */
      let invoiceInfo = await teamworkHelper.getInvoiceInfo(req.body.invoice.id);
      const {invoice} = invoiceInfo = JSON.parse(invoiceInfo);
      data = Object.assign({}, data, { totalCost: invoice['total-cost'] });
      let message = JSON.stringify(data);
      await sendToQueue(message)
      res.sendStatus(200);
    } else {
      const userID = req.body.eventCreator.id;
      let personInfo = await teamworkHelper.getPersonInfo(userID);
      const {person} = personInfo = JSON.parse(personInfo);
      let emailAddress = person['email-address'];
      let userName = person['user-name'];
      /*
      check user email
       */
      if (validateEmail(emailAddress)) {
        await mailer._notify(emailAddress, 'Incorrect invoice number, check it');
      } else if (validateEmail(userName)) {
        await mailer._notify(emailAddress, 'Incorrect invoice number, check it');
      } else {
        await mailer._notify(config.supportEmail, `User ${person['last-name']} ${person['first-name']}
        passed incorrect invoice number: ${req.body.invoice.number}`);
      }
      res.sendStatus(200);
    }
  } catch (err) {
    next(err)
  }
}

exports.completed = completed
