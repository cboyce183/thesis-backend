const mongoose = require('mongoose');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Domo = require('../zendomo.js');

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
    const userInfo = {
      img: user[0].profilePic,
      username: user[0].username,
      id: user[0]._id,
    }
    res.push(userInfo);
  }
  return {users: res}
}


module.exports = {
  listUsersForAdmin,
  listUsersForUser,
}
