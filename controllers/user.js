const newUser = require('../models/insertdata')
const randomUser = require ('../mock/mocks');

module.exports = async function add (ctx) {
  const data = await newUser.addUser(randomUser.user) //ctx.request.body
  if (data)
    ctx.status = 200;
  else
    ctx.body = 'This user already exists';
}
