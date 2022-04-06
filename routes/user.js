const express = require('express');
const routerUser = express.Router();
const userController = require('../controllers/user.js');

routerUser.post('/register', userController.register);
routerUser.post('/login', userController.login);

module.exports = routerUser;