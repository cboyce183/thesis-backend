const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const addCompany = require('../controllers/company');
const addUser = require('../controllers/user');
const authenticate = require('./authenticate');
const getInfo = require('../controllers/common');
const jwt = require('./jwt');

// POST requests
router.post('/add-company', addCompany);
router.post('/add-user', addUser);

// GET requests
router.get('/info', jwt, getInfo);
router.get('/login', async (next) => {
  await authenticate(next);
})

module.exports = router;
