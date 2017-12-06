const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);
const Domo = require('../zendomo.js');
const mailer = require('../server/mailer/mailer');
const Token = mongoose.model('Tokens', Schemas.TokenSchema);
const sendToAWS = require('./aws.js')

async function addCompany (newCompanyInfo) {
  console.log('creating new company...');
  try {
    const company = await Company.find({email: newCompanyInfo.email.toLowerCase()});
    if (!company.length) {
      const newCompany = new Company(newCompanyInfo);
      const hash = bcrypt.hashSync(newCompanyInfo.password, 10);
      newCompany.isAdmin = true;
      newCompany.password = hash;
      newCompany.logo = await sendToAWS(newCompanyInfo.logo, newCompany.name);
      await newCompany.save();
      const newToken = new Token();
      console.log('======LOGGER new company created:', newCompany.email);
      newToken.email = newCompany.email;
      newToken.isAdmin = true;
      await newToken.save();
      return true;
    } else
      return false;
  } catch (e) {
    throw e;
  }
}

async function addUser (companyEmail, userInfo) {
  console.log('======LOGGER\n', companyEmail, 'added a new user', '\n======');
  try {
    const user = await User.find({email: userInfo.email});
    //I check if the user exists in the user collection
    if (!user.length) {
      const newUser = new User(userInfo);
        newUser.company = companyEmail;
        await newUser.save();
        //I need to grab the id of the user just saved
        const id = await User.findOne({email: newUser.email}, '_id');
        //After I saved the new user in the db, I send an email to confirm the registration
        await mailer(newUser,id);
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
    console.error(e);
    return 'err';

  }
}

const delUser = async (companyEmail, userId) => { //need to be tested yet
  try {
    let company = new Company();
    company = await Company.findOne({email: company.email});
    for (let i = 0; i < company[0].userId.length; i++) {
      if (company[0].usersId[i]._id == userId.id) {
        company[0].userId[i].splice(i,1);
        await company[0].save();
        return true;
      }
    }
  } catch (e) {
    console.error(e);
    return 'err'
  }
}

async function signup (user, urlId) {
  let oldUserInfo = await User.findOne({email: user.email});
  if (!oldUserInfo) return null;
  if (oldUserInfo['_id'].toString() !== urlId['user-id'].toString()) {
    return false;
  }
  //If there is already a password stored, it means that the account
  //has already signed up
  if (oldUserInfo.password)
    return false;
  let newProfile = new User(oldUserInfo);
  newProfile.firstName = user.firstName;
  newProfile.username = user.username;
  newProfile.password = bcrypt.hashSync(user.password, 10);
  newProfile.profilePic = await sendToAWS(user.profilePic, user.username);
  newProfile.hashkey = null;
  newProfile.isAdmin = false;
  newProfile.lastName = user.lastName;
  newProfile.availableCurrency = user.availableCurrency;
  newProfile.receivedCurrency = user.receivedCurrency;
  newProfile.createdOn = Date.now();
  await newProfile.save();
  await Domo.createUser(newProfile._id, newProfile.firstName, newProfile.lastName); //adds user to blockchain
  //I want to add the id of the user in the company db only after we are
  //sure that the user has successfully signed up
  //I look for the company where we want the user to be added and I push his id
  const company = await Company.findOne({email: oldUserInfo.company}, 'usersId'); //newUser.company
  company.usersId.push(newProfile._id);
  const updatedCompany = new Company(company);
  await updatedCompany.save();
  const newToken = new Token();
  newToken.email = user.email;
  newToken.isAdmin = false;
  await newToken.save();
  return true;
}

const getCompanyPage = async (companyEmail) => {
  try {
    const companyInfo = await Company.find({email: companyEmail});
    const userIdList = companyInfo[0].usersId;
    const financialInfo = await Domo.getAllUsers();
    const userList = userIdList.filter(id => (companyInfo[0].usersId.indexOf(id) !== -1))
    const totalTokens = financialInfo.reduce((acc, user) => {
      if (userList.indexOf(user.tradeId) != -1) {
        return acc + user.tokens;
      } else {
        return acc;
      }
    },0);
    const panelCompanyInfo = {
      companyName: companyInfo[0].name,
      catalogN: companyInfo[0].catalog.length,
      usersIdN: companyInfo[0].usersId.length,
      totalGiven: totalTokens,
      logo: companyInfo[0].logo,
      weeklyAllow: companyInfo[0].weeklyAllow,
      address: companyInfo[0].address,
      isAdmin: true,
    }
    return (companyInfo) ? panelCompanyInfo : false;
  } catch (e) {
    throw e;
  }
}

const getUserPage = async (userEmail) => {
  try {
    const userInfo = await User.find({email: userEmail});
    const financialInfo = await Domo.getOneUser(userInfo[0]._id);
    const panelUserInfo = {
      username: userInfo[0].username,
      availableCurrency: financialInfo.credits,
      receivedCurrency: financialInfo.tokens,
      isAdmin: false,
    }
    return (userInfo) ? panelUserInfo : false;
  } catch (e) {
    throw e;
  }
}

const getUserInfo = async (companyEmail, userId) => {
  try {
    let company = new Company();
    company = await Company.find({});
    const userInfo = await User.find({id: userId.id});
    return (userInfo) ? userInfo : false;
  } catch (e) {
    throw e;
  }
}

// const getSettings = async (info) => {
//   try {
//     const settings = await Company.find({email: info.email});
//     if (settings) {
//       return {
//         name: settings.name,
//         coinName: settings.coinName,
//         color: settings.color,
//         logo: settings.logo,
//         name: settings.name,
//         address: settings.address
//       };
//     } else
//       return false;
//   } catch (e) {
//     throw e;
//   }
// }

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
  //getSettings,
  editSettings,
  getCompanyPage,
  getUserInfo,
  delUser,
  getUserPage,
}
