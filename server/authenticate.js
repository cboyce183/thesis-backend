const jwt = require('jsonwebtoken');

module.exports = function (ctx) {
    ctx.body = {
      token: jwt.sign({username: 'admin' }, 'xxx'), //Should be the same secret key as the one used is ./jwt.js
      message: "Successfully logged in!"
    };
  return ctx;
}
