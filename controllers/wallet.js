const Transaction = require('../models/transactions');
const adminPrivilege = require('../server/auth/usertype');
const tip = require('../models/tip');

async function addFunds (ctx) {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const data = await Transaction.addFunds(ctx.request.body.id, ctx.request.body.amount, companyEmail); // to be replaced with ctx.request.body
  data ? ctx.status = 200 : ctx.body = 'Operation failed';
}

async function transferFunds (ctx) {
    const data = await Transaction.transferFunds(ctx.request.body.senderID, ctx.request.body.receiverID, ctx.request.body.amount);
    data ? ctx.status = 200 : ctx.body = 'Transaction failed';
}

async function tipUser (ctx) {
  const email = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));

  const data = await tip.tipUser(ctx.request.body.id, ctx.request.body.amount, ctx.request.body.reason, email)
  data ? ctx.status = 200 : ctx.body = 'Transaction failed';
}

module.exports = {
    addFunds,
    transferFunds,
    tipUser
}
