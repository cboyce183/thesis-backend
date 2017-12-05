const setUser = require('../models/insertdata');
const randomUser = require('../mock/mocks');
const adminPrivilege = require('../server/auth/usertype');
const catalog = require('../models/catalog');

const add = async (ctx) => {
  console.log('controller, adding a user...');
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  console.log('isAdmin?', isAdmin, companyEmail);
  if (isAdmin) {
    const res = await setUser.addUser(companyEmail, ctx.request.body)
    return (res) ? ctx.status = 200 : ctx.status = 409;
  } else {
    ctx.status = 403; //forbidden, in case the admin tries to buy an item
  }
}

const buyItem = async (ctx) => {
  const urlId = ctx.url.match(/\/(\w+)$/)[1];
  const userEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (!isAdmin) {
    const res = await catalog.buy(userEmail, urlId, ctx.request.body);
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
  const userId = ctx.request.query;
  const data = await setUser.signup(ctx.request.body, userId); // to be replaced with ctx.request.body
  console.log('data', data);
  if (!data) {
    ctx.status = 401;
  } else {
    ctx.status = 200;
  }
}

module.exports = {
  add,
  edit,
  signup,
  buyItem,
}
