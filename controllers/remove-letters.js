const removeLetter = require('../models/insertdata')

module.exports = async function remove (ctx) {
  const data = await removeLetter.remove(ctx.request.body);
  ctx.status = 200;
}
