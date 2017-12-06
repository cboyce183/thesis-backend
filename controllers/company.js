const catalog = require('../models/catalog');
const randomCompany = require('../mock/mocks');
const adminPrivilege = require('../server/auth/usertype');
const Settings = require('../models/insertdata');
const check = require('./common.js');
const tip = require('../models/tip');
const transaction = require('../models/transactions');
const history = require('../models/history');
const addCompany = async (ctx) => {

  const res = await Settings.addCompany(ctx.request.body); //ctx.request.body
  (res) ? ctx.status = 201 : ctx.status = 409; //409:conflict, it means that there is already an account registred with the given email
}

const addItem = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
   if (isAdmin) {
     const product = ctx.request.body;
    //I check the price of the product
    if (check.price(product.price) === 422) return ctx.status = 422;
    //I truncate the number in case I receive a decimal number
    product.price = Math.trunc(product.price);
    //I check if the content sent in the request body is a product or a service
    if (product.isService) {
      ctx.status = 200;
      return await catalog.add(ctx.request.body, companyEmail, product.isService)
    } else if (!product.isService) {
      await catalog.add(ctx.request.body, companyEmail, product.isService) //to be replaced with ctx.request.body and companyEmail
      return ctx.status = 201;
    } else {
      //Probably useless check, it can't be undefined, but you never know... black magic is always behind the corner
      return ctx.response.body = 'ops... something went wrong';
    }
  }
  return ctx.status = 403; //forbidden, in case the user tries to access to the admin page
}

const delItem = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    const urlId = ctx.url.match(/\/(\w+)$/)[1];
    await catalog.del(companyEmail,urlId)
    ctx.status = 204;
  } else {
    ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}


const editItem = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    const res = await catalog.edit('rodrick_schneider@gmail.com', {_id: '5a2015bf483e080e19c4bd65', name: 'very sexy cat'}) //to be replaced with ctx.request.body and newItem
    (res) ? ctx.status = 204 : ctx.body = 'ops... something went wrong';
  } else {
    ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}

const getItems = async (ctx) => {
  const userEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  console.log('======LOGGER\n', userEmail, 'is retrieving the list of items', '\n======');

  if (isAdmin) {
    ctx.status = 201;
    ctx.response.body = await catalog.get(userEmail, isAdmin);
  } else if (!isAdmin) {
    ctx.status = 201;
    ctx.response.body = await catalog.get(userEmail, isAdmin);
  } else {
    ctx.status = 403;
  }
}

const getCompanyPage = async (ctx) => {
  const email = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  console.log('======LOGGER\n', email, 'requested company page\n admin status:', isAdmin,'\n======');
  if (isAdmin === 'not found') {
    return ctx.status = 403;
  } else if (isAdmin) {
    const data = await Settings.getCompanyPage(email);
    data ? ctx.response.body = data : ctx.status = 404;
  } else if (!isAdmin) {
    const data = await Settings.getUserPage(email);
    data ? ctx.response.body = data : ctx.status = 404;
  }
}

const getUserInfo = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    ctx.status = 201;
    ctx.response.body = await Settings.getUserInfo('olen.mosciski78@gmail.com', {id: '13092902'}); //to be replaced with companyEmail
  } else {
    ctx.status = 403; //forbidden, in case the user tries to access to the admin page
  }
}

const getSettings = async (ctx) => {
  const data = await Settings.getSettings(ctx.request.body);
  data ? ctx.response.body = data : ctx.status = 404;
}

const updateSettings = async (ctx) => {
  const companyEmail = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    const data = await Settings.editSettings(ctx.request.body);
    data ? ctx.status = 200 : ctx.status = 418;
  }

}

const listUsers = async (ctx) => {
  const email = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    const data = await tip.listUsersForAdmin(email, isAdmin);
    data ? ctx.body = data : ctx.status = 404;
  } else if (!isAdmin) {
    const data = await tip.listUsersForUser(email, isAdmin);
    data ? ctx.body = data : ctx.status = 404;
  }
}

const getAdminTransactions = async (ctx) => {
  const email = await adminPrivilege.userEmail(ctx.headers.authorization.slice(7));
  const isAdmin = await adminPrivilege.checkUserType(ctx.headers.authorization.slice(7));
  if (isAdmin) {
    ctx.body = await history.getHistory(email, isAdmin);
    ctx.status = 200;
  } else if (!isAdmin) {
    const fullHistory = await history.getUserHistory(email);

    const filteredHistory = userHistory(fullHistory);
    const transactionsInfo = {
      recentTransactions: filteredHistory,
      userToUserCompTotal: companyTotal(filteredHistory, 'UserToUser'),
      userSpentCompTotal: companyTotal(filteredHistory, 'UserSpent'),
    };
    ctx.body = transactionsInfo;
    ctx.status = 200;
  }
}

const companyTotal = (filteredHistory, type) => {
  return filteredHistory.filter (transaction => {
    return transaction.type == type;
  }).reduce ((acc, transaction) =>{
    return acc + parseInt(transaction.amount);
  }, 0);
}

const userHistory = (fullHistory) => {
  return fullHistory.history.filter ((transaction) => {
    return transaction.from.id == fullHistory.user.id || transaction.to.id == fullHistory.user.id;
  });
}

module.exports = {
  addCompany,
  addItem,
  getItems,
  delItem,
  editItem,
  getSettings,
  updateSettings,
  getCompanyPage,
  getUserInfo,
  listUsers,
  getAdminTransactions,
}
