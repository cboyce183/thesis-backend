const mongoose = require('mongoose');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Domo = require('../zendomo.js');
const Transaction = require('../models/transactions');
const history = require('./history');

const listUsersForUser = async (companyEmail, isAdmin) => {
    var user = await User.find({email: companyEmail});
    companyEmail = user[0].company;
    let company = new Company();
    let res = [];
    company = await Company.find({email: companyEmail});
    companyUsers = company[0].usersId;

    for (let i = 0; i < company[0].usersId.length; i++) {
      if (company[0].usersId[i] != user[0]._id) {
        const user = await User.find({_id: company[0].usersId[i]});
        const userInfo = {
          img: user[0].profilePic,
          username: user[0].username,
          id: user[0]._id,
        }
        res.push(userInfo);
      }
    }
    return {users: res}
}

const listUsersForAdmin = async (companyEmail, isAdmin) => {
  let company = new Company();
  let res = [];
  company = await Company.find({email: companyEmail});
  for (let i = 0; i < company[0].usersId.length; i++) {
    const user = await User.find({_id: company[0].usersId[i]});
    if (!user[0]) return {users: []};
    const userInfo = {
      img: user[0].profilePic,
      username: user[0].username,
      id: user[0]._id,
    }
    res.push(userInfo);
  }
  return {users: res}
}

const tipUser = async (idReceiver, amount, reason, emailSender) => {
  const company = await Company.find({email: emailSender});
  let user = new User();
  if (!company.length) { //not an admin
    user = await User.find({email: emailSender})
    await Transaction.tipUser(idReceiver, amount, user[0]._id);
    const senderInfo = await User.find({email: emailSender});
    console.log('========= HERE');
    const data = await Domo.donation(senderInfo[0]._id, amount);
    console.log('DATA=======', data);
    if (!user.length) console.log('good luck');
    const receiverInfo = await User.find({_id: idReceiver})
    const receiver = receiverInfo[0];
    const sender = senderInfo[0];
    const financialReceiver = await Domo.getOneUser(receiver._id);
    console.log('FINANCIAL RECEIVER', financialReceiver, 'RECEIVER', receiver._id);
    const financialSender = await Domo.getOneUser(sender._id);
    console.log('======LOGGER\n', financialSender.firstName, ' has just tipped', financialReceiver.firstName, amount, 'zen');
    const response = history.history(receiver, sender, amount, 'UserToUser', reason, senderInfo[0].company, financialSender, financialReceiver);
    const addTransaction = await history.saveHistory(response, senderInfo[0].company)
  } else if (company.length) {
    await Transaction.tipUser(idReceiver, amount);
    // can be refactored, same code repeated
    const receiverInfo = await User.find({_id: idReceiver})
    const senderInfo = await Company.find({email: emailSender});
    const receiver = receiverInfo[0];
    const sender = senderInfo[0];
    const financialReceiver = await Domo.getOneUser(receiver._id);
    const financialSender = await Domo.getOneUser(sender._id);
    const response = history.history(receiver, sender, amount, 'AdminExpense', reason, senderInfo[0].company, financialSender, financialReceiver);
    const addTransaction = await history.saveHistory(response, senderInfo[0].email)
    //
  } else {
    ctx.status = 404;
  }

}

module.exports = {
  listUsersForAdmin,
  listUsersForUser,
  tipUser,
}
