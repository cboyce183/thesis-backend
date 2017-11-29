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
  const data = await setUser.editUser({email: 'user4@user.com'}); // to be replaced with ctx.request.body
  if (!data) {
    ctx.status = 401;
  } else {
    ctx.status = 200;
    //ctx.response.body = JSON.stringify(data)
  }
}

async function signup (ctx) {
  const userId = ctx.request.query;
  const data = await setUser.signup({email: 'valentina.predovic57@gmail.com'}, userId); // to be replaced with ctx.request.body
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
