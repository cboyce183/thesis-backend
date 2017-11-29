const setUser = require('../models/insertdata');
const randomUser = require('../mock/mocks');

async function add (ctx) {
  const data = await setUser.addUser(randomUser.user) // to be replaced with ctx.request.body
  if (data)
    ctx.status = 200;
  else
    ctx.body = 'This user already exists';
}

async function edit (ctx) {
  const data = await setUser.edit(ctx.request.body); // to be replaced with ctx.request.body
  if (!data) {
    ctx.status = 401;
  } else {
    ctx.status = 200;
    //ctx.response.body = JSON.stringify(data)
  }
}

async function signup (ctx) {
  const data = await setUser.signup({email: 'user5@user.com', password:'hello', profilePic:'http://google.com/pic.png'}); // to be replaced with ctx.request.body
  if (!data) {
    ctx.status = 401;
  } else {
    ctx.status = 200;
  }
}

module.exports = {
  add: add,
  edit: edit,
  signup: signup
}
