const setUser = require('../models/insertdata');
const randomUser = require('../mock/mocks');
const adminPrivilege = require('../server/auth/usertype');

const add = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    const res = await setUser.addUser(companyEmail, randomUser.user) // to be replaced with ctx.request.body
    return (res) ? ctx.status = 200 : ctx.status = 409;
  } else {
    ctx.status = 403; //forbidden, in case the admin tries to buy an item
  }
}

const buyItem = async (ctx) => {
  const userEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (!isAdmin) {
    const res = await catalog.buyItem(userEmail, ctx.request.query.id, ctx.request.body);
    (res) ? ctx.status = 201 : ctx.body = 'ops... something went wrong';
  } else {
    ctx.status = 403; //forbidden, in case the admin tries to buy an item
  }
}

const edit = async (ctx) => {
  const isAdmin = await adminPrivilege(ctx.headers.authorization.slice(7));
  if (!isAdmin) {
    const data = await setUser.editUser({email: 'godfrey_okuneva25@yahoo.com'}); // to be replaced with ctx.request.body
    if (!data) {
      ctx.status = 401;
    } else if (data == 'err') {
      ctx.status = 500;
    } else {
      ctx.status = 200;
    }
  } else {
    ctx.status = 403 //In this case an admin tried to access to a user page. Status 403: forbidden
  }
}

const signup = async (ctx) => {
  console.log('query', ctx.request.query);
  const userId = ctx.request.query;
  const data = await setUser.signup({email: 'edwina_jerde87@yahoo.com', password:"hellouser",}, userId); // to be replaced with ctx.request.body
  console.log('data', data);
  if (!data) {
    ctx.status = 401;
  } else {
    ctx.status = 200;
  }
}

const signupRequest = async (ctx) => {
  ctx.status = 307;
  //I need to redirect to the sign up page
}

module.exports = {
  add,
  edit,
  signup,
  buyItem,
  signupRequest,
}
