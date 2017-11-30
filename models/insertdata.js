const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Domo = require('../zendomo.js');
const mailer = require('../server/mailer/mailer');

async function addCompany (newCompanyInfo) {
  try {
    const company = await Company.find({email: newCompanyInfo.email.toLowerCase()})
    if (!company.length) {
      const newCompany = new Company(newCompanyInfo);
      const hash = bcrypt.hashSync(newCompanyInfo.password, 10);
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
    const user = await User.find({email: obj().email});
    //I check if the user exist in the user collection
    if (!user.length) {
      const newUser = new User(obj());
      const hash = bcrypt.hashSync(obj().password, 10);
        newUser.password = hash;
        await newUser.save();
        //I need to grab the id of the user just saved
        const id = await User.findOne({email: newUser.email}, '_id');
        //After I saved the new user in the db, I send an email to confirm the registration
        await mailer(newUser,id);
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

async function editUser (user) {
  try {
    //Check if the email already exist. If it exists returns 401
    const oldUserInfo = await User.findOne({email: user.email});
    if (!oldUserInfo) return null;
    let newUserInfo = new User(oldUserInfo);
    //Add a new profile pic if there is any
    newUserInfo.profilePic = user.profilePic || newUserInfo.profilePic;
    newUserInfo.password = bcrypt.hashSync(user.password, 10) || newUserInfo.password;
    await newUserInfo.save();
    await Domo.editOneUser(newUserInfo._id, newUserInfo.firstName, newUserInfo.lastName); //edits relevent user info in domo
    return 'ok';
  } catch (e) {
    console.log('------------ oh oh oh shitstorm is coming... \n', e, '\n------------');
    return 'err';

  }
}

async function signup (user, urlId) {
  let oldUserInfo = await User.findOne({email: user.email});
  if (!oldUserInfo) return null;
  if (oldUserInfo['_id'].toString() !== urlId['user-id'].toString()) {
    return false;
  }
  //If the following values are not empty it means that the user tried to change
  //settings from the sign up page
  if (oldUserInfo.profilePic || oldUserInfo.password)
    return false;
  let newProfile = new User(oldUserInfo);
  await Domo.createUser(newProfile._id, newProfile.firstName, newProfile.lastName); //adds user to blockchain
  newProfile.profilePic = user.profilePic;
  newProfile.password = bcrypt.hashSync(user.password, 10);
  await newProfile.save();

  return true;
}

const getSettings = async (info) => {
  try {
    const settings = await Company.find({email: info.email});
    if (settings) {
      return {
        name: settings.name,
        coinName: settings.coinName,
        color: settings.color,
        logo: settings.logo,
        name: settings.name,
        address: settings.address
      };
    } else
      return false;
  } catch (e) {
    throw e;
  }
}

const editSettings = async (info) => { //?? have to test this ??//
  try {
    const defaults = await Company.find({ email: info.email });
    const settings = await Company.findOneAndUpdate(
      { email: info.email },
      {
        $set: {
          "name": info.name || defaults.name,  
          "coinName": info.coinName || defaults.coinName,
          "color": info.color || defaults.color,
          "address": info.address || defaults.address,
          "allowance": info.allowance || defaults.allowance,
          "logo": info.logo || defaults.logo
        }
      },
      { returnNewDocument: true }
    );
    return settings;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  addCompany,
  addUser,
  editUser,
  signup,
  getSettings,
  editSettings
}
