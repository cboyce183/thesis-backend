const Transaction = require('../models/transactions');
const adminPrivilege = require('../server/auth/usertype');

async function addFunds (ctx) {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const data = await Transaction.addFunds(ctx.request.body.id, ctx.request.body.ammount, companyEmail); // to be replaced with ctx.request.body
  data ? ctx.status = 200 : ctx.body = 'Operation failed';
}

async function transferFunds (ctx) {
    const data = await Transaction.transferFunds(ctx.request.body.senderID, ctx.request.body.receiverID, ctx.request.body.ammount);
    data ? ctx.status = 200 : ctx.body = 'Transaction failed';
}

async function tipUser (ctx) {
    const data = await Transaction.tipUser(ctx.request.body.id, ctx.request.body.ammount);
    data ? ctx.status = 200 : ctx.body = 'Transaction failed';
}

module.exports = {
    addFunds,
    transferFunds,
    tipUser
}
