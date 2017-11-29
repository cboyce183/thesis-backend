const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Domo = require('../zendomo.js');

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
        const updatedCompany = new Company(company);
        await updatedCompany.save();
      return true;
    } else
      return false;
  } catch (e) {
    throw e;
  }
}

async function getInfo (email) {

}

async function editUser (user) {
  //Check if the email already exist. If it exists returns 401
  const oldUserInfo = await User.findOne({email: user.email});
  if (!oldUserInfo) return null;
  let newUserInfo = new User(oldUserInfo);
  //Add a new profile pic if there is any
  newUserInfo.profilePic = user.profilePic || newUserInfo.profilePic;
  newUserInfo.email = user.email || newUserInfo.email;
  newUserInfo.password = bcrypt.hashSync(user.password, 10) || newUserInfo.password;
  await newUserInfo.save();
  await Domo.editOneUser(newUserInfo._id, newUserInfo.firstName, newUserInfo.lastName); //edits relevent user info in domo
  return 'ok';
}

async function signup (user) {
  let oldUserInfo = await User.findOne({email: user.email});
  if (!oldUserInfo) return null;
  if (oldUserInfo.profilePic || oldUserInfo.password)
    return false;
  let newProfile = new User(oldUserInfo);
  await Domo.createUser(newProfile._id, newProfile.firstName, newProfile.lastName); //adds user to blockchain  
  newProfile.profilePic = user.profilePic;
  newProfile.password = bcrypt.hashSync(user.password, 10);
  await newProfile.save();
  return true;

// ------- TRIED AND MISERABLY FAILED TO DO IT WITH A LOOP
  //oldUserInfo = oldUserInfo.toJSON()
  // I check if any other key of the object is empty
  // If they have a content return false
  // It means that the user tried to change his info from the signup page
  // for (let property in oldUserInfo) {
  //   console.log('property check', property);
  //   if (oldUserInfo.hasOwnProperty(property) && property !== 'email' && property !=='_id' && property !=='__v')
  //       if (oldUserInfo[property]) {
  //         console.log('in if ', oldUserInfo[property]);
  //         return false;
  //       } else {
  //         console.log('property update', newProfile[property], user[property], 'property', property);
  //         newProfile[property] = user[property]
  //       }
  // }
  //Complete the registration
  //Add a new profile pic if there is any

}

module.exports = {
  addCompany: addCompany,
  addUser: addUser,
  editUser: editUser,
  signup:signup,
}
