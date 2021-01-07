const express = require('express');
const routes = express.Router();
const usersFunctions = require('../controller/usersController.js');




routes.route('/register')
.post(usersFunctions.addNewUser);

routes.route('/login')
.post(usersFunctions.login);


module.exports = routes;