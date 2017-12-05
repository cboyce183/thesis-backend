const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schemas = require('../../models/schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Token = mongoose.model('Tokens', Schemas.TokenSchema);
const bcrypt = require('bcrypt');
const atob = require('atob');

module.exports = async function (ctx) {
  console.log('authentication...');
    const userpass = atob(ctx.header.authorization.slice(6, ctx.header.authorization.length));
    console.log('user pass', userpass);
    const email = userpass.split(':')[0];
    const password = userpass.split(':')[1];
    console.log('email', email, 'pass', password);
    const person = await User.findOne({email: email}, 'password email isAdmin');
      //If there is not any user, I check in the company db
      if (!person) {
          const company = await Company.findOne({email: email}, 'password email isAdmin');
            if (!company) {
              ctx.status = 401;
              return ctx.body = 'Email not found';
            }
            const checkPass = await bcrypt.compare(password, company.password);
            ctx.body = await sign(checkPass, ctx, company.email, company.isAdmin);
            if (!ctx.body) ctx.status = 401;
      } else {
        const checkPass = await bcrypt.compare(password, person.password);
        ctx.body = await sign(checkPass, ctx, person.email, person.isAdmin);
        if (!ctx.body) ctx.status = 401;
      }
    return ctx;
}

async function sign (authenticated, ctx, email, admin) {
  console.log('authentication:', authenticated, email, admin);
    if (authenticated) {
      //I send the token in the body
      const token = ctx.body = {
        token: jwt.sign({email: email }, 'xxx'),
      }
      //I check if the token already exist in the db
      //and I check whether the user is an admin or not
      const isToken = await Token.find({email: email});
      console.log('is token', isToken);
      isToken[0].token = token.token;
      await isToken[0].save();
      if (isToken.length) {
        if (isToken[0].isAdmin) {
          return ctx.body = {
            isAdmin: true,
            token: token.token
          };
        }
        return ctx.body = {
          isAdmin:  false,
          token: token.token
        };
      } else {
        //I save the token into the db
        console.log('a new token has been created...', token.token);
        const newToken = new Token();
        newToken.token = token.token;
        newToken.email = email;
        newToken.isAdmin = admin;
        await newToken.save();
        return token;
      }
    }
}
