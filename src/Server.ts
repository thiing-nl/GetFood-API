import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';
import '@tsed/mongoose';
import '@tsed/swagger';
import './v2/modules/auth/AuthMiddleware';
import GlobalErrorHandlerMiddleware from './v2/modules/auth/ErrorMiddleware';

require('dotenv').config();

@ServerSettings({
  rootDir: __dirname,
  acceptMimes: [ 'application/json' ],
  passport: {},
  mount: {
    '/v2': `${__dirname}/v2/modules/**/**Controller.js`,
    '/': `${__dirname}/core/**/**Controller.js`
  },
  mongoose: {
    url: process.env.MONGOOSE_URL || 'mongodb://127.0.0.1:27017/getfood-api-prod'
  },
  swagger: [
    {
      path: '/api-docs',
      doc: 'api-v2',
      spec: {
        info: {},
        securityDefinitions: {
          'token': {
            'type': 'apiKey',
            'name': 'X-User-Token',
            'in': 'header'
          }
        }
      }
    }
  ],
  debug: false
})
export class Server extends ServerLoader {

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  $onMountingMiddlewares(): void | Promise<any> {

    const cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      compress = require('compression'),
      methodOverride = require('method-override'),
      session = require('express-session');


    this
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(session({
        secret: 'mysecretkey',
        resave: true,
        saveUninitialized: true,
        maxAge: 36000,
        cookie: {
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: null
        }
      }))
      .use((
        req,
        res,
        next
      ) => {
        res.set(
          'Access-Control-Allow-Origin',
          req.headers.origin
        );
        res.set(
          'Access-Control-Allow-Credentials',
          'true'
        );
        res.set(
          'Access-Control-Allow-Headers',
          'X-User-Token, Content-Type'
        );
        res.set(
          'Access-Control-Allow-Methods',
          'POST, GET, DELETE, PUT, OPTIONS'
        );
        next();
      });

    return null;
  }

  $afterRoutesInit() {
    this
      .use(GlobalErrorHandlerMiddleware)
      .use((
        req,
        res
      ) => res.status(404).json({ err: true, message: 'Not Found' }));
  }
}
