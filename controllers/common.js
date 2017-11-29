const mock = require('../mock/mocks');
const email = require('../models/insertdata');
async function getInfo (ctx) {
  ctx.body = 'hello'
  //const data = await email.getInfo({email: "user4@user.com", password:'ciao'}) //ctx.request.body
  // if (ctx.headers['type'] === 'user@user.com') {
  //   ctx.status = 200
  //   return ctx.body = mock.user()
  // } else if (ctx.headers['type'] === 'admin@admin.com'){
  //   ctx.status = 200
  //   return ctx.body = mock.company()
  // }
}

module.exports = {
  getInfo: getInfo
}
