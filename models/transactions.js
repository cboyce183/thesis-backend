const mongoose = require('mongoose');
const Domo = require('../zendomo.js');

async function addFunds (id, ammount) {
try {
    await Domo.addFunds(id, ammount);
    return true;
} catch (e) {
throw e;
  }
}

async function transferFunds (senderID, receiverID, ammount) {
try {
    await Domo.transferFunds(senderID, receiverID, ammount);
    return true;
} catch (e) {
    throw e;
  }
}

async function tipUser (id, ammount) {
try {
    await Domo.tipUser(id, ammount);
    return true;
} catch (e) {
    throw e;
  }
}

module.exports = {
    addFunds,
    transferFunds,
    tipUser
}
