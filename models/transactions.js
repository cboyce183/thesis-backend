const mongoose = require('mongoose');
const Domo = require('../zendomo.js');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);

const history = (companyInfo, userInfo) => {
  return {
    from: companyInfo,
    to: userInfo,
    amount: ammount,
    transactionType: 'expense',
    date: Date.now()
  }
}

async function addFunds (id, ammount, companyEmail) {
  const companyInfo = Company.find({email: companyEmail});
  const userInfo = User.find({_id: id});
  console.log('history generated', history);
  try {

      await Domo.addFunds(id, ammount);
      company[0].history.push(history(companyInfo, userInfo));
      await company[0].save();
      return true;
  } catch (e) {
    throw e;
  }
}

async function transferFunds (senderID, receiverID, ammount) {
  try {
      await Domo.transferFunds(senderID, receiverID, parseInt(ammount));
      return true;
  } catch (e) {
      throw e;
    }
}

async function tipUser (id, ammount) {
  console.log('id', id, 'amount', ammount);
  try {
    console.log('ADDING FUNDS', ammount);
      await Domo.tipUser(id, parseInt(ammount));
      return true;
  } catch (e) {
      throw e;
    }
}

const getAdminTransactions = async () => {
  return await Domo.getAllUsers();
}

module.exports = {
    addFunds,
    transferFunds,
    tipUser,
    getAdminTransactions
}
