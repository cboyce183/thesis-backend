const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schemas = require('../models/schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const bcrypt = require('bcrypt');
const atob = require('atob');

module.exports = async function (ctx) {
    const userpass = (ctx.header.authorization.slice(6, ctx.header.authorization.length-2));
    const username = atob(userpass).split(':')[0];
    const password = atob(userpass).split(':')[1];
    await Company.findOne({name: username}, 'password', function (err, person) {
      const checkPass = bcrypt.compare(password, person.password)
      if (checkPass) {
        ctx.body = {
          token: jwt.sign({password: ctx.headers.password }, 'xxx')
        };
        ctx.status = 200;
      }
    })
  return ctx;
}
