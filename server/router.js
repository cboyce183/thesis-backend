const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const name = require('../controllers/get-letters');
const postLetter = require('../controllers/add-company');
const removeLetter = require('../controllers/remove-letters');

router.get('/letter', name);
router.post('/addcompany', postLetter);
router.del('/letter', removeLetter);
module.exports = router;
