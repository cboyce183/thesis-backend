const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schemas = require('../models/schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);

module.exports = function (ctx) {
    Company.findOne({name: 'Hills LLC'}, 'password', function (err, person) {
      if (person.password === ctx.headers.password) {
        ctx.body = {
          token: jwt.sign({password: ctx.headers.password }, 'xxx'), //Should be the same secret key as the one used is ./jwt.js
          message: "Successfully logged in!"
        };
        ctx.status = 200;
      }
    })
  return ctx; 
}
