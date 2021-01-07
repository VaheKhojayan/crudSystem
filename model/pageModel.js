const mongoose = require ('mongoose');

const pageSchema = new mongoose.Schema({

   title: { 
    type: String,
     required: true 
    },
   description:{ 
    type: String
     },
   content:{
    type: String, 
    required: true 
  },
   imgname:{ 
    type: String,
     required: true },

},{timestamp:true});



const pages = mongoose.model('pages', pageSchema);


module.exports= pages;