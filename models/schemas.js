const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
  username: String,
  email: {
    type: String,
    lowercase: true
  },
  profilePic: String,
  hashkey: String,
  isAdmin: Boolean,
  availableCurrency: Number,
  receivedCurrency: Number,
  company: String,
  createdOn: Number //timestamp ?? or date ??
});

const CatalogSchema = mongoose.Schema({
  name: String,
  picture: String,
  value: Number,
  isService: Boolean,
  schedule: Date, //???????????????????? what
  createdOn: Number //timestamp
});

const AdminSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    lowercase: true
  },
  password: String,
  logo: String,
  weeklyAllow: Number,
  coinName: String,
  isAdmin: Boolean,
  usersId: [ String ],
  catalog: [ CatalogSchema ],
  createdOn: Number, //timestamp ??????????????????? what
  address: String,
  color: String,
  history:
    [
      {
        from: {},
        to: {},
        amount: Number,
        transactionType: String,
        date: Date,
      }
    ]
});

const TokenSchema = mongoose.Schema({
  token: String,
  isAdmin: Boolean,
  email: String
});

module.exports = {
  UserSchema : UserSchema,
  AdminSchema: AdminSchema,
  CatalogSchema: CatalogSchema,
  TokenSchema: TokenSchema
}
