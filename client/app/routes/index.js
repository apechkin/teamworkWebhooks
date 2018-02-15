const express = require('express');
const router = express.Router();
const invoice = require('../invoice');
const cors = require('cors');

let corsOptions = {
  origin: [/\.teamwork\.com$/],
  methods: ['POST']
}

router.post('/completed', cors(corsOptions), invoice.completed);

module.exports = router;
