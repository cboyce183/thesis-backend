const mock = require('../mock/mocks');

module.exports = function getInfo (ctx) {
  if (ctx.headers['type'] === 'user@user.com') {
    ctx.status = 200
    return ctx.body = mock.user()
  } else if (ctx.headers['type'] === 'admin@admin.com'){
    ctx.status = 200
    return ctx.body = mock.company()
  }
}
