const data = require('../models/insertdata')

module.exports = async function retrieve (ctx) {
  const result = await data.retrieveAll();
  ctx.response.body = result;
}
