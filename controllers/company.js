const catalog = require('../models/catalog');
const randomCompany = require('../mock/mocks');
const adminPrivilege = require('../server/auth/usertype');
const Settings = require('../models/insertdata');
const check = require('./common.js');
const tip = require('../models/tip');
const addCompany = async (ctx) => {

  const res = await Settings.addCompany(ctx.request.body); //ctx.request.body
  (res) ? ctx.status = 201 : ctx.status = 409; //409:conflict, it means that there is already an account registred with the given email
}

const addItem = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
   if (isAdmin) {
     const product = ctx.request.body;
    //I check the price of the product
    if (check.price(product.price) === 422) return ctx.status = 422;
    //I truncate the number in case I receive a decimal number
    product.price = Math.trunc(product.price);
    //I check if the content sent in the request body is a product or a service
    if (product.isService) {
      ctx.status = 200;
      return await catalog.add(ctx.request.body, companyEmail, product.isService)
    } else if (!product.isService) {
      await catalog.add(ctx.request.body, companyEmail, product.isService) //to be replaced with ctx.request.body and companyEmail
      return ctx.status = 201;
    } else {
      //Probably useless check, it can't be undefined, but you never know... black magic is always behind the corner
      return ctx.response.body = 'ops... something went wrong';
    }
  }
  return ctx.status = 403; //forbidden, in case the user tries to access to the admin page
}

const delItem = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    const urlId = ctx.url.match(/\/(\w+)$/)[1];
    await catalog.del(companyEmail,urlId)
    ctx.status = 204;
  } else {
    ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}


const editItem = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    const res = await catalog.edit('rodrick_schneider@gmail.com', {_id: '5a2015bf483e080e19c4bd65', name: 'very sexy cat'}) //to be replaced with ctx.request.body and newItem
    (res) ? ctx.status = 204 : ctx.body = 'ops... something went wrong';
  } else {
    ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}

const getItems = async (ctx) => {
  console.log('in controller getting items');
  const userEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));

  if (isAdmin) {
    ctx.status = 201;
    ctx.response.body = await catalog.get(userEmail, isAdmin);
  } else if (!isAdmin) {
    ctx.status = 201;
    ctx.response.body = await catalog.get(userEmail, isAdmin);
  } else {
    ctx.status = 403;
  }
}

const getCompanyPage = async (ctx) => {
  const email = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    console.log('is admin', email);
    const data = await Settings.getCompanyPage(email);
    data ? ctx.response.body = data : ctx.status = 404;
  } else if (!isAdmin) {
    console.log('not admin', email);
    const data = await Settings.getUserPage(email);
    console.log('data',data);
    data ? ctx.response.body = data : ctx.status = 404;
  }
}

const getUserInfo = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    ctx.status = 201;
    ctx.response.body = await Settings.getUserInfo('olen.mosciski78@gmail.com', {id: '13092902'}); //to be replaced with companyEmail
  } else {
    ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}

const getSettings = async (ctx) => {
  const data = await Settings.getSettings(ctx.request.body);
  data ? ctx.response.body = data : ctx.status = 404;
}

const updateSettings = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    const data = await Settings.editSettings(ctx.request.body);
    console.log('data', data);
    data ? ctx.status = 200 : ctx.status = 418;
  }

}

const listUsers = async (ctx) => {
  const email = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    console.log('admin');
    const data = await tip.listUsersForAdmin(email, isAdmin);
    data ? ctx.body = data : ctx.status = 404;
  } else if (!isAdmin) {
    console.log('not admin');
    const data = await tip.listUsersForUser(email, isAdmin);
    data ? ctx.body = data : ctx.status = 404;
  } else {
    ctx.status = 403
  }

}

module.exports = {
  addCompany,
  addItem,
  getItems,
  delItem,
  editItem,
  getSettings,
  updateSettings,
  getCompanyPage,
  getUserInfo,
  listUsers,
}
