const Transaction = require('../models/transactions');

async function addFunds (ctx) {
  const data = await Transaction.addFunds(ctx.body.id, ctx.body.ammount) // to be replaced with ctx.request.body
  data ? ctx.status = 200 : ctx.body = 'Operation failed';
}

async function transferFunds (ctx) {
    const data = await Transaction.transferFunds(ctx.body.senderID, ctx.body.receiverID, ctx.body.ammount);
    data ? ctx.status = 200 : ctx.body = 'Transaction failed';
}

async function tipUser (ctx) {
    const data = await Transaction.tipUser(ctx.body.id, ctx.body.ammount);
    data ? ctx.status = 200 : ctx.body = 'Transaction failed';
}

module.exports = {
    addFunds,
    transferFunds,
    tipUser
}
