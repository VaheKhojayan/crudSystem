const mongoose = require ('mongoose');
const joi = require('@hapi/joi');

const registerValidation = (data) => {
  const schema = joi.object({
    name:joi.string().min(2).max(255).required(),
    email:joi.string().min(6).max(255).required().email(),
    password:joi.string().min(6).max(255),
  });
  return schema.validate(data);
};


const schema = new mongoose.Schema({
  name: {
    type: String
  },
   email: {
    type: String,
    unique:true,
  },
   password: {
    type: String
  },

});


const users = mongoose.model('users', schema);


module.exports= 
{
 registerValidation,
 users
}