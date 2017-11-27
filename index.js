const bash = require('./bash-compiler.js');
const Koa = require('koa');
const app = new Koa();
const logger = require('koa-logger');
const router = require('./server/router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors')

bash.series([
  'echo "the current version of node being used: "',
  'node --version'
])

app
  .use(logger())
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .listen(3000);
