const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Domo = require('../zendomo.js');
const mailer = require('../server/mailer/mailer');
const Token = mongoose.model('Tokens', Schemas.TokenSchema);

const history = (receiver, sender, amount, transactionType, reason, companyEmail) => {
  return {
    from: {
      id: sender._id,
      username: sender.username,
      profilePic: sender.profilePic || sender.logo,
    },
    to: {
      id: receiver._id,
      username: receiver.username,
      profilePic: receiver.profilePic || receiver.logo,
    },
    amount: amount,
    type: transactionType,
    reason: reason,
    fromBalance: null,
    toBalance: null,
    _id: null, //transaction id
    date: Date.now(),
    company: companyEmail,
  }
}

const saveHistory = async (history, companyEmail) => {

  const company = await Company.find({email: companyEmail});
  console.log('COMPANY',company, companyEmail);
  company[0].history.push(history);
  await company[0].save();
  return true;
}

module.exports = {
  history,
  saveHistory,
}
