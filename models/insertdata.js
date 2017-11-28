const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);

async function addCompany (obj) {
  try {
    const company = await Company.find({name: obj().email})
    if (!company.length) {
      const newCompany = new Company(obj());
      const hash = bcrypt.hashSync(obj().password, 10);
      newCompany.password = hash;
      newCompany.save();
      return true;

    } else
      return false;
  } catch (e) {
    throw e;
  }
}

async function addUser (obj) {
  try {

    const user = await User.find({email: obj().email})
    //I check if the user exist in the user collection
    if (!user.length) {
      const newUser = new User(obj());
      const hash = bcrypt.hashSync(obj().password, 10);
        newUser.password = hash;
        await newUser.save();
        const id = await User.findOne({email: newUser.email}, '_id');
        //I look for the company where we want the user to be added and I push his id
        const company = await Company.findOne({name: 'McClure - Buckridge'}, 'usersId'); //newUser.company
        company.usersId.push(id);
        const updatedCompany = new Company(company)
        await updatedCompany.save();
        console.log('company', company);

      return true;
    } else
      return false;
  } catch (e) {
    throw e;
  }
}
//
// async function editUser (user) {
//   const oldUserInfo = User.findOne({email: user.email});
//   console.log('old user info', oldUserInfo);
//
// }

module.exports = {
  addCompany: addCompany,
  addUser: addUser,
  //editUser: editUser
}
