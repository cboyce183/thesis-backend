const catalog = require('../models/catalog');
const randomCompany = require('../mock/mocks');
const adminPrivilege = require('../server/auth/usertype');
const Settings = require('../models/insertdata');

async function add (ctx) {
  const data = await Settings.addCompany(randomCompany.company()); //ctx.request.body
  (data) ? ctx.status = 201 : ctx.status = 409; //409:conflict, it means that there is already an account registred with the given email
}

async function addItem (ctx) {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  const data = {isService: false}; //to be replaced with ctx.request.body
   if (isAdmin) {
    //I check if the content sent in the request body is a product or a service
    if (data.isService) {
      await catalog.add({name: 'sexy cat'}, 'rodrick_schneider@gmail.com', data.isService) // //to be replaced with ctx.request.body and companyEmail
    } else if (!data.isService) {
      await catalog.add({name: 'sexy cat'}, 'rodrick_schneider@gmail.com', data.isService) //to be replaced with ctx.request.body and companyEmail
      ctx.status = 201;
    } else {
      //Probably useless check, it can't be undefined, but you never know... black magic is always behind the corner
      ctx.response.body = 'ops... something went wrong';
    }
  } else {
    ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}

async function delItem (ctx) {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    await catalog.del('rodrick_schneider@gmail.com',{id: '5a20209cbc98a20eef1bf178'}) //to be replaced with ctx.request.body
    ctx.status = 204;
  } else {
    ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}

const delUser = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    await Settings.delUser('rodrick_schneider@gmail.com', {id: '5a20209cbc98a20eef1bf178'}) //to be replaced with ctx.request.body
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

async function getItems (ctx) {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    ctx.status = 201;
    ctx.response.body = await catalog.get('olen.mosciski78@gmail.com'); //to be replaced with companyEmail
  } else {
    ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}

async function getCompanyInfo (ctx) {
  const data = await Settings.getCompanyInfo(ctx.request.body);
  data ? ctx.response.body = data : ctx.status = 404;
}

async function getUserInfo (ctx) {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    ctx.status = 201;
    ctx.response.body = await Settings.getUserInfo('olen.mosciski78@gmail.com', {id: '13092902'}); //to be replaced with companyEmail
  } else {
    ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}

async function getSettings (ctx) {
  const data = await Settings.getSettings(ctx.request.body);
  data ? ctx.response.body = data : ctx.status = 404;
}

async function updateSettings (ctx) {
  const data = await Settings.editSettings(ctx.request.body);
  data ? ctx.status = 200 : ctx.status = 418;
}

module.exports = {
  add,
  addItem,
  getItems,
  delItem,
  editItem,
  getSettings,
  updateSettings,
  getCompanyInfo,
  getUserInfo,
  delUser,
}
