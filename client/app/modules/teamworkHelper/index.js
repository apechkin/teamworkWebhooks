const rp  = require('request-promise-native');
const config = require('../config');

function TeamworkHelper(options) {
  this._company = options.company;
  this._key = options.key;
  this._auth = new Buffer(`${this._key}:xxx`).toString('base64');
  this.getPersonInfo = (userID) => {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        uri: `https://${this._company}.teamwork.com/people/${userID}.json`,
        method: 'GET',
        headers: {
          'Authorization': `BASIC ${this._auth}`,
          'Content-Type': 'application/json'
        }
      };
      return rp(requestOptions)
      .then((body) => {
        resolve(body);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
  this.getInvoiceInfo = (invoice) => {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        uri: `https://${this._company}.teamwork.com/invoices/${invoice}.json`,
        method: 'GET',
        headers: {
          'Authorization': `BASIC ${this._auth}`,
          'Content-Type': 'application/json'
        }
      };
      return rp(requestOptions)
      .then((body) => {
        resolve(body);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
}
const teamworkHelper = new TeamworkHelper(config);
module.exports = teamworkHelper;
