import * as _ from 'lodash';
import { $log } from 'ts-log-debug';
import { slack } from './core/Slack';
import { Server } from './Server';

require('dotenv').config();

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
    } else {
      $log.info('Slack not enabled.');
    }
  })
  .catch((er) => console.error(er));
