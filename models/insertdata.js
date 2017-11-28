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
      bcrypt.hash(obj().password, 10, (err, hash) => {
        newUser.password = hash;

        //I first save the user in the user collection in order to get his id
        newUser.save();
        let id;
        //I search for the user just saved and I get his id
        User.findOne({firstName: obj().email}, '_id' , function (err, user) {
          id = user.id
        })
        //I look for the company where we want the user to be added and I push his id
        Company.findOneAndUpdate({company: obj().company}, {}, function(err, company) {
          //I update the value and save it
          company.usersId.push(id)
          const updateCompany = new Company(company)
          updateCompany.save()
        })



      })

      return true;
    } else
      return false;
  } catch (e) {
    throw e;
  }

}


module.exports = {
  addCompany: addCompany,
  addUser: addUser
}
