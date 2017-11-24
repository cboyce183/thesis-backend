const insertLetter = require('../models/insertdata')

module.exports = async function add (ctx) {
  const data = await insertLetter.add(ctx.request.body)
  ctx.status = 200;
}
