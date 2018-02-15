const amqp = require('amqplib');
const uuid = require('node-uuid');
const config = require('../config');

function RabbitHelper(options) {
  this._uri = options.uri
  this._queueName = options.q
  this._callbackQueueName = options.callbackQ

  this._connect = () => {
    return new Promise((resolve, reject) => {
      return amqp.connect(this._uri)
      .then((connection) => {
        resolve(connection);
      })
      .catch((err) => {
        reject(err);
      })
    });
  }

  this._closeConnection = (connection) => {
    return connection.close();
  }

  this._channel = (connection) => {
    return new Promise((resolve, reject) => {
      return connection.createChannel()
      .then((ch) => {
        resolve(ch)
      })
      .catch((err) => {
        reject(err)
      })
    });
  }

  this.sendMessage = (queue, message, options) => {
    return new Promise((resolve, reject) => {
      return this._connect(this._uri)
      .then((conn) => {
        return this._channel(conn);
      })
      .then((ch) => {
        let ok = ch.assertQueue(queue, {durable: true});
        return ok.then(() => {
          return ch.sendToQueue(queue, Buffer.from(message), options);
        }).then(() => {
          resolve();
        })
      })
      .catch((err) => {
        reject(err);
      })
    });
  }

  this._awaitMessage = (channel, message) => {
    return new Promise((resolve, reject) => {
      let corrId = uuid();

      const checkAnswer = (msg) => {
        if (msg.properties.correlationId === corrId) {
          let resultMessage = msg.content.toString();
          let data = JSON.parse(resultMessage);
          return this._answerToTeamWork(data).then(() => {
            resolve(resultMessage);
          });
        }
      }

      return channel.assertQueue(this._callbackQueueName, {durable: true, autoDelete: true})
        .then((q) => {
          return q.queue;
        })
        .then((queue) => {
          return channel.consume(queue, checkAnswer, {noAck: false}).then(() => {
            return queue;
          })
        })
        .then((queue) => {
          return channel.sendToQueue(this._queueName, Buffer.from(message), {
            correlationId: corrId, replyTo: queue, persistent: true
          });
        })
        .catch((err) => {
          reject(err);
      })
    });
  }

 // answer to teamwork API
  this._answerToTeamWork = (data) => {
    return new Promise((resolve, reject) => {
      resolve()
    });
  }
}

const rabbitHelper = new RabbitHelper(config);
module.exports = rabbitHelper;
