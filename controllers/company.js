const catalog = require('../models/catalog');
const randomCompany = require('../mock/mocks');
const adminPrivilege = require('../server/auth/usertype');
const Settings = require('../models/insertdata');

async function add (ctx) {
  const data = await newCompany.addCompany(ctx.request.body) //ctx.request.body
  if (data)
    ctx.status = 201;
  else {
    ctx.body = 'This company already exists';
    ctx.status = 204; //Need to check which status set in this scenario
  }
}

async function addProduct (ctx) {
 const isAdmin = await adminPrivilege(ctx.headers.authorization.slice(7));
 if (isAdmin) {

 } else {
   ctx.status = 403 //forbidden, in case the user tries to access to the admin page
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
  addProduct,
  getSettings,
  updateSettings
}
