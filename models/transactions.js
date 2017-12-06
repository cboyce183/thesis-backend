const mongoose = require('mongoose');
const Domo = require('../zendomo.js');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);

const history = (receiver, sender, amount, transactionType, reason) => {
  return {
    from: {
      id: sender._id,
      username: sender.username,
      profilePic: sender.profilePic || sender.logo,
    }, //id
    to: {
      id: receiver._id,
      username: receiver.username,
      profilePic: receiver.profilePic || receiver.logo,
    }, //id
    amount: amount,
    type: transactionType,
    reason: reason,
    fromBalance: null,
    toBalance: null,
    _id: null, //transaction id
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
      //
      const sender = retrieveInfo(senderID);
      console.log('===========sender', sender);
      const receiver = retrieveInfo(receiverID);
      console.log('=============receiver', receiver);

      //
      return true;
  } catch (e) {
      throw e;
    }
}

const retrieveInfo = async (id) => {
  let company = new Company();
  company = await Company.find({_id: id});
  if (!company.length) {
    const user = await User.find({_id: id});
    if (!user.length) console.log('you re fucked');
    return user[0];
  }
  return company[0];
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
