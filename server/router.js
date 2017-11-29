const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const addCompany = require('../controllers/company');
const user = require('../controllers/user');
const authenticate = require('./authenticate');
const getInfo = require('../controllers/common');
const jwt = require('./jwt');

// POST requests
router.post('/add-company', addCompany);
router.post('/add-user', user.add);
router.post('/signup-user', user.signup);

// GET requests
router.get('/info', getInfo.getInfo);
router.get('/login', async (next) => {
  await authenticate(next);
})

// PUT requests
router.put('/edit-user', user.edit)
module.exports = router;
