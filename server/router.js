const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const company = require('../controllers/company');
const user = require('../controllers/user');
const authenticate = require('./auth/authenticate');
const wallet = require('../controllers/wallet');
const getInfo = require('../controllers/common');
const jwt = require('./auth/jwt');

// POST requests
router.post('/signupcompany', company.addCompany);
router.post('/user', user.add);
router.post('/signup-user', user.signup); //It has to be a put request, has to be reviewed
router.post('/catalog', company.addItem); //Add items to the catalog
router.post(/\/catalog\/product\/.*$/, user.buyItem); //Buy items

// GET requests
router.get('/catalog', company.getItems);
router.get('/company', company.getCompanyPage);
router.get('/settings', company.getSettings);
router.get('/user', company.getUserInfo);
router.get('/tip', company.listUsers);
router.get('/login', async (next) => {
  await authenticate(next);
});

// PUT requests
router.put('/company', company.updateSettings);
router.put('/user', user.edit);
router.put('/tip', wallet.tipUser);
router.put('/transfer', wallet.transferFunds);
router.put('/admin-fund', wallet.addFunds);
router.put('/catalog', company.editItem);

// DEL requests
router.delete(/\/catalog\/.*$/, company.delItem);
router.delete(/\/user\/.*$/, user.delUser);

module.exports = router;
