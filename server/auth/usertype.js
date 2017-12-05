const mongoose = require('mongoose');
const Schemas = require('../../models/schemas');
const Token = mongoose.model('Tokens', Schemas.TokenSchema);

async function checkUserType (token) {
  const userType = await Token.find({token: token});
  //I return the user type if the token is found in the Token collection
  if (userType.length)
    return userType[0].isAdmin;
  return 'not found';
}

async function userEmail (token) {
  console.log('token', token);
  const email = await Token.find({token:token});
  if (email.length)
    return email[0].email;
  return 'not found'
}
module.exports = {
  checkUserType: checkUserType,
  userEmail: userEmail
}
