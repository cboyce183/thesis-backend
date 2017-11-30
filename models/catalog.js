const mongoose = require('mongoose');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Catalog = mongoose.model('Catalog', Schemas.CatalogSchema);
const Domo = require('../zendomo.js');


async function add (product, companyEmail, isService) {
  let company = new Company(); //I need to check if I really need this
  company = await Company.find({email: companyEmail});
  let newProduct = new Catalog();
  newProduct = product;
  newProduct.isService = isService;
  if (!newProduct.isService) {
    newProduct.schedule = null;
  }
  company[0].catalog.push(newProduct);
  await company[0].save();
}

async function del (companyEmail, companyId) {
  let company = new Company();
  company = await Company.find({email: companyEmail});
  for (let i = 0; i < company[0].catalog.length; i++) {
    if (company[0].catalog[i]._id == companyId.id) {
      const x = company[0].catalog.splice(i,1);
      await company[0].save();
      return company[0].catalog.splice(i,1)
    }
  }

}

async function get (companyEmail) {
  const company = await Company.find({email: companyEmail});
  return {catalog: company[0].catalog};
}

module.exports = {
  add: add,
  get: get,
  del: del,
}
