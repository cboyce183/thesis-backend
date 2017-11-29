const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schemas = require('../models/schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Token = mongoose.model('Tokens', Schemas.TokenSchema);
const bcrypt = require('bcrypt');
const atob = require('atob');

module.exports = async function (ctx) {
    const userpass = atob(ctx.header.authorization.slice(6, ctx.header.authorization.length));
    const email = userpass.split(':')[0];
    const password = userpass.split(':')[1];
    const person = await User.findOne({email: email}, 'password email isAdmin');
      //If there is not any user, I check in the company db
      if (!person) {
          const company = await Company.findOne({email: email}, 'password email isAdmin');
            if (!company) {
              ctx.status = 401;
              return ctx.body = 'Email not found';
            }
            const checkPass = bcrypt.compare(password, company.password);
            ctx.body = await sign(checkPass, ctx, company.email, company.isAdmin);
            if (!ctx.body) ctx.status = 401;
      } else {
        console.log('person', person);
        const checkPass = await bcrypt.compare(password, person.password);
        ctx.body = await sign(checkPass, ctx, person.email, person.isAdmin);
        if (!ctx.body) ctx.status = 401;
      }
    return ctx;
}

async function sign (authenticated, ctx, email, admin) {
    if (authenticated) {
      // I send the token in the body
      const token = ctx.body = {
        token: jwt.sign({email: email }, 'xxx'),
      }
      //I check if the token already exist in the db
      //and I check whether the user is an admin or not
      console.log('lookgi for', token.token, ' into the db');
      const isToken = await Token.find({email: email});
      console.log('token in the db', isToken);
      if (isToken.length) {
        if (isToken.isAdmin)
          return ctx.body = true;
        return ctx.body = false;
      } else {
        //I save the token into the db
        const newToken = new Token();
        newToken.token = token.token;
        newToken.email = email;
        newToken.isAdmin = admin;
        console.log('saving the new token...', newToken);
        await newToken.save();
        return token;
      }
    }
}
