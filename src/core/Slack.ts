import * as _ from 'lodash';
require('dotenv').config();

export let slack;
if ( !_.isNil(process.env[ 'SLACK_WEBHOOK_URL' ]) && _.isString(process.env[ 'SLACK_WEBHOOK_URL' ]) ) {
  slack = require('slack-notify')(process.env[ 'SLACK_WEBHOOK_URL' ]);
}
