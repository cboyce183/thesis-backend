const mongoose = require('mongoose');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Catalog = mongoose.model('Catalog', Schemas.CatalogSchema);
const Domo = require('../zendomo.js');


const add = async (product, companyEmail, isService) => {
  console.log('add item', product, companyEmail, isService);
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

const buy = async (userEmail, idItem, infoProduct) => { //Need to be tested
  console.log('USER BUYING', userEmail, idItem, infoProduct);
  const user = await User.find({email: userEmail});
  console.log('user', user);
  await Domo.purchase(user[0]._id, infoProduct.price);
  //Need to send an email to the admin
  //now store arguments
}

const del = async (companyEmail, companyId) => {
  let company = new Company();
  company = await Company.find({email: companyEmail});
  for (let i = 0; i < company[0].catalog.length; i++) {
    if (company[0].catalog[i]._id == companyId) {
      const x = company[0].catalog.splice(i,1);
      await company[0].save();
      return x;
    }
  }
}

const get = async (email, isAdmin) => {
  if (!isAdmin) {
    const user = await User.find({email: email});
    email = user[0].company;
  }
  const company = await Company.find({email: email});
  return {catalog: company[0].catalog};
}

const edit = async (companyEmail, item) => {
  let company = new Company();
  company = await Company.find({email: companyEmail});
  for (let i = 0; i < company[0].catalog.length; i++) {
    if (company[0].catalog[i]._id == item._id) {
      company[0].catalog[i] = item;
      await company[0].save();
      return true;
    }
  }
}

module.exports = {
  add: add,
  get: get,
  del: del,
  edit: edit,
  buy: buy,
}
