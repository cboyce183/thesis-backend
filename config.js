const mongoose = require('mongoose');
mongoose.Promise = Promise;
//to be replaced with the app name

mongoose.connect('mongodb://localhost/Zendama');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => { console.log('connected to the db...')})

module.exports = db
