const koaJwt = require('koa-jwt');

module.exports = koaJwt({
  secret: 'xxx', // Should not be hardcoded
});
