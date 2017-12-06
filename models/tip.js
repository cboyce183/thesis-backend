const mongoose = require('mongoose');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Domo = require('../zendomo.js');
const Transaction = require('../models/transactions');


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
    console.log('====== USER INFO', user, '==========');
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
  console.log('COMPANY', company);
  if (!company.length) { //not an admin
    user = await User.find({email: emailSender})
    await Transaction.tipUser(idReceiver, amount);
    const idSender = await sender(emailSender);
    console.log('ID USER', idSender, 'amount', amount);
    const data = await Domo.donation(idSender, amount);
    console.log('DATA', data);
    if (!user.length) console.error('good luck');
  } else if (company.length) {
    await Transaction.tipUser(idReceiver, amount);
  } else {
    ctx.status = 404;
  }

}

const sender = async (emailSender) => {
  const company = await Company.find({email: emailSender});
  let user = new User();
  if (!company.length) {
    user = await User.find({email: emailSender});
  }
  console.log('USER', user);
  return user[0]._id;
}

module.exports = {
  listUsersForAdmin,
  listUsersForUser,
  tipUser,
}
