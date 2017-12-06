const mongoose = require('mongoose');
const Domo = require('../zendomo.js');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);

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

// async function transferFunds (senderID, receiverID, ammount) {
//   try {
//       await Domo.transferFunds(senderID, receiverID, parseInt(ammount));
//       //
//       const sender = retrieveInfo(senderID);
//       console.log('===========sender', sender);
//       const receiver = retrieveInfo(receiverID);
//       console.log('=============receiver', receiver);
//
//       //
//       return true;
//   } catch (e) {
//       throw e;
//     }
// }

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

async function tipUser (receiverId, ammount, senderId) {
  try {
      await Domo.tipUser(receiverId, parseInt(ammount));
      const sender = retrieveInfo(senderId);
      const receiver = retrieveInfo(receiverId);
      console.log('======LOGGER\n', 'someone is tipping someone\n', '======')
      return true;
  } catch (e) {
      throw e;
    }
}

const getAdminTransactions = async () => {
  return await Domo.getAllUsers();
}

//IMA FIX DIS SHIT!

module.exports = {
    addFunds,
    tipUser,
    getAdminTransactions
}
