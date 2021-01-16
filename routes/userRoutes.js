const express = require('express');
const routes = express.Router();
const usersFunctions = require('../controller/usersController.js');


routes.route('/logout')
.get(usersFunctions.getLandingPage);

routes.route('/home')
.get(usersFunctions.verifyToken,usersFunctions.getHomePage)
.post(usersFunctions.verifyToken,usersFunctions.addNewArticle);


routes.route('/admin')
.get(usersFunctions.verifyToken,usersFunctions.getAdminPage);


routes.route('/addnewarticle')
        .get(usersFunctions.getAddNewArticlePage);

routes.route('/readarticle')
        .get(usersFunctions.readArticle);

routes.route('/updatearticle')
        .get(usersFunctions.updateArticle)
        .post(usersFunctions.saveUpdatedArticle);

routes.route('/deletearticle')
        .delete(usersFunctions.deleteArticle);



module.exports = routes;