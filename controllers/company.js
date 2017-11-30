const catalog = require('../models/catalog');
const newCompany = require('../models/insertdata');
const randomCompany = require('../mock/mocks');
const adminPrivilege = require('../server/auth/usertype');

async function add (ctx) {
  const data = await newCompany.addCompany(randomCompany.company()) //ctx.request.body
  if (data)
    ctx.status = 201;
  else {
    ctx.body = 'This company already exists';
    ctx.status = 204; //Need to check which status set in this scenario
  }
}

async function addItem (ctx) {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  const data = {isService: false}; //to be replaced with ctx.request.body
   if (isAdmin) {
    //I check if the content sent in the request body is a product or a service
    if (data.isService) {
      await catalog.add({name: 'sexy cat'}, 'olen.mosciski78@gmail.com', data.isService) // //to be replaced with ctx.request.body and companyEmail
    } else if (!data.isService) {
      await catalog.add({name: 'sexy cat'}, 'olen.mosciski78@gmail.com', data.isService) //to be replaced with ctx.request.body and companyEmail
      ctx.status = 201;
    } else {
      ctx.response.body = 'ops... something went wrong';
    }
  } else {
     ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}
module.exports = {
  add : add,
  addItem: addItem
}
