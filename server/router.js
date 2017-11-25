const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const name = require('../controllers/get-letters');
const addCompany = require('../controllers/add-company');
const removeLetter = require('../controllers/remove-letters');
const authenticate = require('./authenticate');


router.get('/letter', name);
router.post('/addcompany', addCompany);
router.get('/logincompany', async (next) => {
  await authenticate(next);
})
router.del('/letter', removeLetter);
module.exports = router;
