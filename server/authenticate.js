const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schemas = require('../models/schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const bcrypt = require('bcrypt');
const atob = require('atob');

module.exports = async function (ctx) {
    const userpass = atob(ctx.header.authorization.slice(6, ctx.header.authorization.length));
    const email = userpass.split(':')[0];
    const password = userpass.split(':')[1];
    const person = await User.findOne({email: email}, 'password email');
      //If there is not any user, I check in the company db
      if (!person) {
          const company = await Company.findOne({email: email}, 'password isAdmin');
            if (!company) {
              ctx.status = 401;
              return ctx.body = 'Email not found';
            }
            const checkPass = bcrypt.compare(password, company.password);
            ctx.body = await sign(checkPass, ctx, company.email);
            if (!ctx.body) ctx.status = 401;
      } else {
        const checkPass = await bcrypt.compare(password, person.password);
        ctx.body = await sign(checkPass, ctx, person.email);
        if (!ctx.body) ctx.status = 401;
      }
    return ctx;
}

function sign(authenticated, ctx, email) {
    if (authenticated) {
      return ctx.body = {
        //replace with the email
        token: jwt.sign({email: email }, 'xxx'),
      }
    }
}
