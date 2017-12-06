const mongoose = require('mongoose');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Catalog = mongoose.model('Catalog', Schemas.CatalogSchema);
const Domo = require('../zendomo.js');
const history = require('./history');

const add = async (product, companyEmail, isService) => {
  let company = new Company(); //I need to check if I really need this
  company = await Company.find({email: companyEmail});
  let newProduct = new Catalog();
  newProduct = product;
  newProduct.picture = await sendToAWS(product.picture,product.name);
  newProduct.isService = isService;
  if (!newProduct.isService) {
    newProduct.schedule = null;
  }
  company[0].catalog.push(newProduct);
  await company[0].save();
}

const buy = async (userEmail, idItem, infoProduct) => {
  const user = await User.find({email: userEmail});
  await Domo.purchase(user[0]._id, infoProduct.price);
  const receiverInfo = await Company.find({email: user[0].company})
  const senderInfo = await User.find({email: userEmail});
  const receiver = receiverInfo[0];
  const sender = senderInfo[0];
  const financialReceiver = await Domo.getOneUser(receiver._id);
  const financialSender = await Domo.getOneUser(sender._id);
  const response = history.history(receiver, sender, infoProduct.price, 'UserSpent', infoProduct.name, user[0].company, financialSender, financialReceiver);
  const addTransaction = await history.saveHistory(response, sender.company);
  console.log('======LOGGER \n product bought', addTransaction, '\n======');
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
