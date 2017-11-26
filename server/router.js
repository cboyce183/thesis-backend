const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const addCompany = require('../controllers/company');
const addUser = require('../controllers/user');
const authenticate = require('./authenticate');
const getInfo = require('../controllers/common');
// POST requests
router.post('/add-company', addCompany);
router.post('/add-user', addUser);

// GET requests
router.get('/info', getInfo);
router.get('/logincompany', async (next) => {
  await authenticate(next);
})

module.exports = router;
