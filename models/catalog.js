const mongoose = require('mongoose');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Catalog = mongoose.model('Catalog', Schemas.CatalogSchema);
const Domo = require('../zendomo.js');


async function add (product, companyEmail, isService) {
  let company = new Company();
  company = await Company.find({email: companyEmail});
  let newProduct = new Catalog();
  newProduct = product;
  newProduct.isService = isService;
  console.log('new product', newProduct, isService);
  company[0].catalog.push(newProduct);
  await company[0].save();
}

async function addService (service, companyEmail) {

}
module.exports = {
  add: add
}
