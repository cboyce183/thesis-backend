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
  theme:String,
  logo:String
})

const User = mongoose.model('Users', UserSchema);

function add(obj) {
  return new Promise((resolved, rejected) => {
    const addUser = new User(obj)
    addUser.save((err, letter) => {
      if (err) return rejected(err);
      resolved('ok');
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
  add: add,
  remove: remove
}
