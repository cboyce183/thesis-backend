const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schemas = require('./schemas');
const Company = mongoose.model('Companies', Schemas.AdminSchema);
const User = mongoose.model('Users', Schemas.UserSchema);

//When I save a new user into userSchema, I need to store in the AdminSchema the id of the new UserSchema as well.
//I have two collections: 1) database of users, 2) database of Companies
//When a user logs in (sending his email address) I need to check whether he is an admin or a regular user.
//To do so, I need to look into the company db first because it is smaller and then into the user db.


//await AdminSchema.findOneAndUpdate({name: obj.name},{users: obj.users.push({firstName: 'hello'})})

async function addCompany (obj) {
  try {
    const company = await Company.find({name: obj().name})
    if (!company.length) {
      const newCompany = new Company(obj());
      bcrypt.hash('obj().password', 10, function (err, hash) {
        obj().password = hash;
      })
      await newCompany.save();
      return true;
    } else
      return false;
  } catch (e) {
    throw e;
  }
}

async function addUser (obj) {
  try {
    const newUser = new User(obj);
    await newUser.save();
    return true
  } catch (e) {
    throw e;
  }

}


module.exports = {
  addCompany: addCompany,
  addUser: addUser
}
