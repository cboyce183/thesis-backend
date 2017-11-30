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
router.post('/add-company', company.add);
router.post('/add-user', user.add);
router.post('/signup-user', user.signup); //It has to be a put request, has to be reviewed
router.post('/item', company.addItem);

// GET requests
router.get('/info', getInfo.getInfo); //This is meant for testing, ignore it
router.get('/login', async (next) => {
  await authenticate(next);
});
router.get('/catalog', company.getItems);

// PUT requests
})
router.get('/settings', company.settings);

// PUT requests
router.put('/admin-settings', company.updateSettings);
router.put('/edit-user', user.edit);
router.put('/admin-tip', wallet.tipUser);
router.put('/transfer', wallet.transferFunds);
router.put('/admin-fund', wallet.addFunds);

// DEL requests
router.delete('/item', company.delItem);

module.exports = router;
