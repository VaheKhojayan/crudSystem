const express = require('express');
const routes = express.Router();
const usersFunctions = require('../controller/usersController.js');


routes.route('/').get(usersFunctions.getLandingPage);
routes.route('/login').get(usersFunctions.getLoginPage);
routes.route('/register').get(usersFunctions.getRegisterPage);

module.exports = routes;