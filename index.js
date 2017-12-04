const bash = require('./bash-compiler.js');
const Koa = require('koa');
const app = new Koa();
const logger = require('koa-logger');
const router = require('./server/router');
const bodyParser = require('koa-bodyparser');

const cors = require('koa2-cors');
const koaJwt = require('koa-jwt');
const db = require('./config');

app
  .use(logger())
  .use(bodyParser())
  .use(cors())
  .use(koaJwt({secret: 'xxx'})
    .unless({path: [
      '/',
      '/login',
      new RegExp('\/signup-user.*','i'),
      '/favicon.ico',
    ]}))
  .use(router.routes())
  .listen(4200);
