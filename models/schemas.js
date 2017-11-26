const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  password:String,
  hashkey:String,
  admin:Boolean,
  availableCurrency:Number,
  receivedCurrency:Number,
});

const AdminSchema = mongoose.Schema({
  name:String,
  email: String,
  password:String,
  logo:String,
  weeklyAllow:Number,
  coinName:String,
  isAdmin:Boolean,
  usersId:[Number]
})

module.exports = {
  UserSchema : UserSchema,
  AdminSchema: AdminSchema
}
