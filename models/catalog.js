const mongoose = require('mongoose');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Catalog = mongoose.model('Catalog', Schemas.CatalogSchema);
const Domo = require('../zendomo.js');


async function addProduct (product, companyEmail) {
  let company = new Company()
  company = await Company.find({email: companyEmail});
  let newProduct = new Catalog();
  newProduct = product;
  company[0].catalog.push(newProduct);
  await company[0].save();
}

module.exports = {
  addProduct: addProduct
}
