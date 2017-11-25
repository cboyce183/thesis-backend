const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/MainRoot'); //to be replaced with the app name

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => { console.log('connected to the db...')})

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
  isAdmin:Boolean
})

const Company = mongoose.model('Users', AdminSchema);

function addCompany(obj) {
  return new Promise((resolved, rejected) => {
    const addCompany = new Company(obj)
    addCompany.save((err, info) => {
      if (err) return rejected(err);
      resolved(info);
    });
  });
}

function retrieveAll() {
  return new Promise ((resolved, rejected) => {
    User.find((err, users) => {
      if (err) return rejected(err);
      resolved(users);
    });
  });
}

function remove(obj) {
  return new Promise ((resolved, rejected) => {
    User.remove(obj, function (err) {
      if (err) return rejected(err);
      resolved('deleted');
    });
  })
}

module.exports = {
  retrieveAll: retrieveAll,
  addCompany: addCompany,
  remove: remove
}
