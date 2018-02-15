const express = require('express');
const helmet = require('helmet');
const app = express();
const errorHandler = require('./modules/errorHandler');
const bodyParser = require('body-parser');
const config = require('./modules/config');

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/teamwork/invoice', require('./routes'));
app.use(errorHandler);

if (!module.parent) {
  app.listen(config.port, () => {
    console.log(`Express server listening on port ${config.port}.`);
  });
}
