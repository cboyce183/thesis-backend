const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Domo = require('../zendomo.js');
const mailer = require('../server/mailer/mailer');
const Token = mongoose.model('Tokens', Schemas.TokenSchema);

const history = (receiver, sender, amount, transactionType, reason, companyEmail, financialSender, financialReceiver) => {
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
    fromBalanceTokens: financialSender.tokens,
    fromBalanceCredits: financialSender.credits,
    toBalanceTokens: financialReceiver.tokens,
    toBalanceCredits: financialReceiver.credits,
    _id: financialSender.tradeId + ':' + financialReceiver.tradeId, //transaction id
    date: Date.now(),
    company: companyEmail,
  }
}

const saveHistory = async (history, companyEmail) => {
  console.log('COMPANY EMAIL', companyEmail);
  const company = await Company.find({email: companyEmail});
  console.log('COMPANY',company, companyEmail);
  company[0].history.push(history);
  await company[0].save();
  return true;
}

const getHistory = async (email, isAdmin) => {
  if (isAdmin) {
    const company = await Company.find({email:email});
    return {
      adminDetails: {username: 'bla', profilePic: null},
      transactions: company[0].history,
    }
  } else if (!isAdmin) {
    const user = await User.find({email:email});
    return {
      adminDetails: {username: 'bla', profilePic: null},
      transactions: user[0].history,
    }
  } else {
    console.error('There is a problem with isAdmin:', isAdmin);
  }
}

const getUserHistory = async (email) => {
  const user = await User.find({email:email});
  const companyEmail = user[0].company;
  const companyInfo = await Company.find({email: companyEmail});
  const companyHistory = companyInfo[0].history;
return {history: companyHistory, user:user[0]};
}

module.exports = {
  history,
  saveHistory,
  getHistory,
  getUserHistory,
}
