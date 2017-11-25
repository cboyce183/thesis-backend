const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  password:String,
  hashkey:String,
  admin:Boolean,
  availableCurrency:Number,
  receivedCurrency:Number
});

const AdminSchema = mongoose.Schema({
  name:String,
  email: String,
  password:String,
  logo:String,
  weeklyAllow:Number,
  coinName:String,
  isAdmin:Boolean,
  users:[UserSchema]
})

const Company = mongoose.model('Companies', AdminSchema);
const User = mongoose.model('Users', UserSchema);

async function addCompany(obj) {
  try {
    const company = await Company.find({name: obj.name})
    if (!company.length) {
      const newCompany = new Company(obj)
      await newCompany.save()
      //await AdminSchema.findOneAndUpdate({name: obj.name},{users: obj.users.push({firstName: 'hello'})})
      return true
    } else
      return false
  } catch (e) {
    throw e;
  }

}

function retrieveAll() {
  return new Promise ((resolved, rejected) => {
    Company.find((err, companies) => {
      if (err) return rejected(err);
      resolved(companies);
    });
  });
}

// Template to remove either a user or a company
// function remove(obj) {
//   return new Promise ((resolved, rejected) => {
//     User.remove(obj, function (err) {
//       if (err) return rejected(err);
//       resolved('deleted');
//     });
//   })
// }

module.exports = {
  retrieveAll: retrieveAll,
  addCompany: addCompany,
  //remove: remove
}
