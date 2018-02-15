const oracledb = require('oracledb');
const options = require('./options');
const logger = require('../logger').dbErrors;
oracledb.outFormat = oracledb.OBJECT;
oracledb.autoCommit = true;

function Ora (options) {
  this.user = options.user
  this.password = options.password
  this.connectString = `${options.host}:${options.port}/${options.service}`
  this.getConnection = () => {
    return new Promise((resolve, reject) => {
      oracledb.getConnection({
        user: this.user,
        password : this.password,
        connectString : this.connectString
      }, (err, connection) => {
        if(err) {
          logger.error(err.message)
          reject(err);
        }
        resolve(connection);
      })
    });
  }
  this.execute = async (sql, bindParams) => {
    let conn;
    try {
      conn = await this.getConnection();
      let result = await conn.execute(sql, bindParams);
      return result;
    } catch (err) {
      logger.error(err.message)
      await Promise.reject(err.message)
    }
     finally {
       if (conn) {
         await this._relase(conn);
       }
    }
  }
  this._relase = (connection) => {
    return new Promise((resolve, reject) => {
      connection.close((err) => {
        if (err) {
          logger.error(err.message)
          reject(err);
        }
        resolve()
      })
    });
  }
}

const ora = new Ora(options)
module.exports = ora
