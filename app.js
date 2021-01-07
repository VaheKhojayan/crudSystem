const mongoose = require ('mongoose');
var express =require('express');
var path = require('path');

var bodyParser =require('body-parser');

var app=express(); 

var urlencodedparser=bodyParser.urlencoded({extended:false});


app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
 

const dblink = require('./config/index.js');

mongoose.connect(dblink.link,{useNewUrlParser: true , useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', ()=>{
	console.log('Connected') 
});


//const routes = require('./routes/crmRoutes.js');
const indexRoutes = require('./routes/indexRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');


app.use('/', indexRoutes);
app.use('/user',urlencodedparser, userRoutes);
app.use('/auth',urlencodedparser, authRoutes);

const users =  require('./model/userTableCreator.js')

//app.use('/',urlencodedparser,routes1,routes2,routes3);

app.listen(3000);


