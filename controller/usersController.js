const model =  require('../model/userTableCreator.js');
const pageModel = require('../model/pageModel.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../config/");

const salt = 10;

var getLandingPage = (req,res) => {
   res.render('landing')
}

var getRegisterPage = (req,res) => {
   res.render('register');
}



var addNewUser = (req,res) => {
	if(!model.registerValidation(req.body).error){

	bcrypt.hash(req.body.password, salt, function(err, hash) {

    model.users.create({name:req.body.name,
	              email:req.body.email,
	              password:hash},
	              (err,result) => {	
        	if (err) console.log(err);
        	console.log('Done');
            //res.json(result);
            //console.log(result);
            res.end();
        })

});
	res.render('login');
}
else {res.write(model.registerValidation(req.body).error.details[0].message),res.end()}
}


//Login

var login = (req,res) => {
     model.users.findOne({email:req.body.email}).exec((err,result) => {
     	if (err) throw err;

     	if(result) {
     		
     	bcrypt.compare(req.body.password,result.password, function(err, result1) {
            if (result1) {
            	res.render('admin')
            }
            else {
            	res.write('No such a user');
            	res.end();
            }
        });
         
 //token

         var token = jwt.sign({ id: model.users.id }, config.secret, {
	        expiresIn: 86400 // 24 hours
	      });


          res.cookie("x-access-token", token)
       //    .status(200).send({
	      //   id: model.users._id,
	      //   username: model.users.username,
	      //   email: model.users.email,
	      //   accessToken: token
	      // });

 
     	}
     	else {
     		res.write('No such a user')
     	}
     
     })
}




var getLoginPage = (req,res) => {
   res.render('login')
}


var getHomePage = (req,res) => {

   pageModel.find().select({__v:0}).exec((err,result) => {
   
        if (err) throw err;
      res.render('home',{result:result})
    })
   
}



//verify token middleware

verifyToken = (req, res, next) => {

  let token =  req.headers["x-access-token"] ;
  // console.log(token);
  // || req.cookies["x-access-token"]

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};




module.exports = {
    getHomePage,
	getLandingPage,
	getRegisterPage,
	getLoginPage,
	addNewUser,
	login,
    verifyToken
}

