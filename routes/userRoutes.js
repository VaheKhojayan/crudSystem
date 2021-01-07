const express = require('express');
const routes = express.Router();
const usersFunctions = require('../controller/usersController.js');


routes.route('/logout')
.get(usersFunctions.getLandingPage);

routes.route('/home')
//.get([usersFunctions.verifyToken],usersFunctions.getHomePage);
.get(usersFunctions.getHomePage);


module.exports = routes;