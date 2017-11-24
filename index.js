const Koa = require('koa');
const app = new Koa();
const logger = require('koa-logger');
const router = require('./server/router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors')
app
  .use(logger())
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .listen(3000);
