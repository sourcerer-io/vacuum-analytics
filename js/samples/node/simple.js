(function() {
'use strict';

const cfg = require('./config.js');
const LogEvent = require('va').LogEvent;

let logger = new LogEvent(
  cfg.logging_url,
  { 'headers' : { 'set-cookie': 'sessionid=bmomob;' } }
);

logger.error("B'eba-%pBeba").
then(
  () => { console.log('done'); },
  (e) => { console.log(e); }
);

}());
