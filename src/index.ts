import * as _ from 'lodash';
import { $log } from 'ts-log-debug';
import { Server } from './Server';

require('dotenv').config();

let slack = null;
if ( !_.isNil(process.env[ 'SLACK_WEBHOOK_URL' ]) && _.isString(process.env[ 'SLACK_WEBHOOK_URL' ]) ) {
  slack = require('slack-notify')(process.env[ 'SLACK_WEBHOOK_URL' ]);
  $log.info('Enabled slack notifications!');
} else {
  $log.info('Disabled slack notifications!');
}

$log.debug('Start server...');
new Server()
  .start()
  .then(() => {
    if ( slack != null ) {
      slack.note({
        channel: process.env[ 'CHANNEL' ] || '#getfood-api',
        text: `Reboot! (${ process.env[ 'ENV' ] || 'production'})`
      }, function (err) {
        if (err) {
          console.log('API error:', err);
        } else {
          console.log('Message received!');
        }
      });
    }
  })
  .catch((er) => console.error(er));
