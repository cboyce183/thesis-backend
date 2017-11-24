const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const name = require('../controllers/get-letters');
const postLetter = require('../controllers/add-letters');
const removeLetter = require('../controllers/remove-letters');

router.get('/letter', name);
router.post('/letter', postLetter);
router.del('/letter', removeLetter);
module.exports = router;
