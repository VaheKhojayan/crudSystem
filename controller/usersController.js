const model =  require('../model/userTableCreator.js');
const pageModel = require('../model/pageModel.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("../config/");
const fs = require('fs');
const formidable = require('formidable');
const path = require('path') ;

const salt = 10;

var getLandingPage = (req,res) => {
  res.cookie('token','deleted',{ httpOnly: true })
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

 //token    

               var token = jwt.sign( {id:model.users.id} , config.secret, {expiresIn: 86400 // 24 hours
        });

 
          res.cookie('token',token)
        //   .status(200).send({
        //   id: model.users._id,
        //   username: model.users.username,
        //   email: model.users.email,
        //   accessToken: token
        // });

              res.redirect('/user/admin');

            }
            else {
            	res.write('No such a user');
            	res.end();
            }
        });
               
 
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


  let token =  req.cookies["token"] ;
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


var getAddNewArticlePage = (req,res) => {
    res.render('addNewArticle')
}

var getAdminPage = (req,res) => {
    res.render('admin')
}

var addNewArticle =  (req,res) => {

let data = new formidable.IncomingForm();

   data.parse(req,async function (err, fields, files) {
   

        var oldPath = files.myFile.path; 
        var newPath = path.join(__dirname, '/../public/uploads/') 
                + '/'+files.myFile.name 
        var data = fs.readFileSync(oldPath) ;

        fs.writeFile(newPath, data, function(err){ 
            if(err) console.log(err)  
        }) 

        fs.unlink(oldPath, (err => { 
  if (err) console.log(err); }))

    await pageModel.create({title:fields.title,
                            description:fields.description,
                            content:fields.content,
                            imgname:files.myFile.name},
                (err,result) => { 
          if (err) {console.log(err);
          return res.redirect('/user/addnewarticle'); }
          console.log('Article created');
            res.end();
        })

  })

    res.redirect('/user/home');

    // pageModel.find().select({__v:0}).exec((err,result) => {
   
    //     if (err) throw err;
    //    res.redirect('/user/home');
    // })
     //res.render('home',{result:result})
 }


 var readArticle = (req,res) => {
  var id= req.query.id;
   pageModel.findOne({_id:id}).select({__v:0}).exec((err,result) => {
   
        if (err) throw err;
     res.render('getarticle',{result:result})
    })
   
 }


  var updateArticle = (req,res) => {
  var id= req.query.id;
   pageModel.findOne({_id:id}).select({__v:0}).exec((err,result) => {
   
        if (err) throw err;
     res.render('updatearticle',{result:result})
    })
   
 }


 var saveUpdatedArticle = (req,res) => {
  let data = new formidable.IncomingForm();

   data.parse(req,async function (err, fields, files) {

     var oldPath = files.myFile.path; 
        var newPath = path.join(__dirname, '/../public/uploads/') 
                + '/'+files.myFile.name 
        var data = fs.readFileSync(oldPath) ;

        fs.writeFile(newPath, data, function(err){ 
            if(err) console.log(err)  
        }) 

        fs.unlink(oldPath, (err => { 
  if (err) console.log(err); }))

  let imgName='';
  let file=files.myFile;
  if(file) {
    imgName= file.name;
     try{
            var pth = path.join(__dirname, '/../public/uploads/')+ '/'+fields.imgname;
            fs.unlink(pth,(err => { 
                   if (err) console.log(err); }));  
                       }
        catch(err){
             console.log(err)
        }
  }
  else {
    imgName=fields.imgname;
  }

  await pageModel.findOneAndUpdate({_id: fields.id},{ 
           title:fields.title,
            description:fields.description,
            content:fields.content,
            imgname:imgName,
          }) ;

    return res.redirect('home')  

 })}


var deleteArticle = (req,res) => {
     pageModel.deleteOne(req.body, function (err) {
         if (err) return console.log(err);
      console.log('deleted');
      return res.json({del:1})
});
}


  


module.exports = {
    getHomePage,
	getLandingPage,
	getRegisterPage,
	getLoginPage,
	addNewUser,
	login,
  verifyToken,
  addNewArticle,
  getAddNewArticlePage,
  getAdminPage,
  readArticle,
  updateArticle,
  saveUpdatedArticle,
  deleteArticle
}

