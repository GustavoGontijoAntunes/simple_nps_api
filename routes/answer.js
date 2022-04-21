const express = require('express');
const routerAnswer = express.Router();
const answerController = require('../controllers/answer.js');
const utilSec = require('../utils/security.js');

routerAnswer.post('/create', utilSec.checkToken, answerController.create);

module.exports = routerAnswer;