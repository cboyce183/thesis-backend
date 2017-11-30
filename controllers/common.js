const mock = require('../mock/mocks');
const email = require('../models/insertdata');
const userType = require('../server/auth/usertype');

//This function is meant for testing
async function getInfo (ctx) {
  const auth = await userType.checkUserType(ctx.headers.authorization.slice(7))
  if (auth) {
    ctx.body = 'it is an admin'
  } else {
    ctx.body = 'it is a user'
  }
}

module.exports = {
  getInfo: getInfo
}
