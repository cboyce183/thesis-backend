const mongoose = require('mongoose');
const Schemas = require('../../models/schemas');
const Token = mongoose.model('Tokens', Schemas.TokenSchema);

module.exports = async function checkUserType (token) {
  const userType = await Token.find({token: token})
  //I return the user type if the token is found in the Token collection
  if (userType.length)
    return userType[0].isAdmin;
  return 'not found';
}
