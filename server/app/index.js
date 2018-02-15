const amqp = require('amqplib');
const uri = process.env.NODE_QUEUE_SERVER || 'amqp://localhost';
const q = process.env.NODE_QUEUE || 'rpc_queue';
const db = require('./db');
const mqLogger = require('./logger').mqErrors;
const mailerLogger = require('./logger').mailerErrors;
const mailer = require('./mailer');

let ch;
const server = async () => {
  try {
    let conn = await amqp.connect(uri);
    process.once('SIGINT', async () => {
      await conn.close();
    });
    ch = await conn.createChannel();
    await ch.assertQueue(q, {durable: true});
    ch.prefetch(1);
    await ch.consume(q, replyMessage);
    console.log(' [x] Awaiting RPC requests');
  } catch (e) {
    await Promise.reject(e);
  }
}

const userOraError = (message) => {
  let regExp =  /ORA-[2][0]\d{3}/g;
  return message.match(regExp);
}

const executeQueue = async (response, msg, ch) => {
  try {
    await ch.sendToQueue(msg.properties.replyTo,
      Buffer.from(response),
      {
        correlationId: msg.properties.correlationId,
        persistent: true
      });
    await ch.ack(msg);
  } catch (err) {
    let errorMessage =  {
      status: 'error',
      message: 'Error in RabbitMQ',
      request: msg.content.toString(),
      error: err
    }
    throw (errorMessage);
  }
}

const replyMessage = async (msg) => {
  let request = JSON.parse(msg.content.toString());
  let response = ''; let sql = '';
  try {
    switch (request.action) {
      case 'invoice.completed':
      try {
        /*
          execute stored procedure
         */
        sql = `BEGIN STORAGE_PKG.FAKE_PROCEDURE(:invoiceNum, :totalCost); END;`;
        await db.execute(sql, {invoiceNum: request.invoice.number, totalCost: parseFloat(request.totalCost)});
      } catch (err) {
        /*
          If db errors in range from ORA-20000 to ORA-20999 then send message to support
          and send response to queue
        */
        if (userOraError(err)) {
          response = Object.assign({}, {
            status: 'error',
            message: 'Catch db error in range ORA-(20000-20999)',
            error: err,
            invoiceNum: request.invoice.number,
            totalCost: request.totalCost
          });
          try {
            await mailer._notify(response, 'json')
          } catch (e) {
            mailerLogger.error(e);
            return null;
          }
          await executeQueue(response, msg, ch);
          break;
        } else {
          /*
            If db errors out of range ORA-20000 to ORA-20999 then send message to support only
          */
          try {
            await mailer._notify(`${err} with params invoiceNum: ${request.invoice.number}, totalCost: ${request.totalCost}`, 'text')
          } catch (e) {
            mailerLogger.error(e);
            return null;
          }
          break;
        }
      }
      response = JSON.stringify(Object.assign({}, {
        status: 'ok',
        message: 'Response for completed action'
      }));
      await executeQueue(response, msg, ch);
      break;
    }
  } catch (err) {
    mqLogger.error(err);
    try {
      await mailer._notify(err, 'json');
    } catch (e) {
      mailerLogger.error(e)
      return null;
    }
    return null;
  }
}

setTimeout(async () => {
  try {
    await server();
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
}, 10000);
