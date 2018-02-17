// Copyright 2018 Sourcerer Inc. All Rights Reserved.
// Author: Alexander Surkov (alex@sourcerer.io)

(function(exports) {

/**
 * Elastic LogStash logging.
 */
class LogEvent
{
  constructor(url, { headers })
  {
    console.assert(url);
    console.assert(headers);

    this.url = url;
    if (headers['set-cookie']) {
      let value = headers['set-cookie'];
      let parts = value.split(';').filter((v) => !!v.trim());
      let cookiePart = parts[0].split('=');
      this.session = cookiePart[1];
    }
  }

  /**
   * Logs an error.
   */
  error(message)
  {
    this.event('error', { message });
  }

  /**
   * Logs an event of the given type.
   */
  event(type, fields)
  {
    let data = Object.assign({
      session: this.session,
      type,
      timestamp: Date.now()
    }, fields);

    let thisobj = this;
    return new Promise((resolve, reject) => {
      ('XMLHttpRequest' in exports) ?
        thisobj.browserRequest(data, resolve, reject) :
        thisobj.nodeRequest(data, resolve, reject);
    });
  }

  nodeRequest(data, resolve, reject)
  {
    let params = encodeURIComponent(JSON.stringify(data));

    let url = new URL(this.url);
    let protocol = url.protocol.replace(':', '');
    if (protocol != 'http' && protocol != 'https') {
      reject({ error: 'Unsupported protocol' });
      return;
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      agent: keepAliveAgent,
      timeout: 1000,
      checkServerIdentity: function (host, cert) {
        return undefined;
      }
    };

    const req = require(protocol).request(options, (res) => {
      if (res.statusCode != 200) {
        reject({
          error: `HTTP error`,
          status: res.statusCode
        });
        return;
      }

      let stream = new require('stream').Transform();
      res.on('data', (chunk) => {
        stream.push(chunk);
      });
      res.on('end', () => {
        resolve(new Buffer(stream.read()));
      });
    });
    req.on('error', (e) => {
      reject({
       error: `HTTP error`,
       status: e
     });
    });
    req.end();
  }

  browserRequest(data, resolve, reject)
  {
    const req = new XMLHttpRequest();
    req.open('POST', this.url, true);

    // Send the proper header information along with the request.
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.withCredentials = true;
    req.onreadystatechange = () => {
      if (req.readyState == 4 && req.status == 200) {
        resolve(req.responseText);
      }
      else {
        reject({
          error: `HTTP error`,
          status: req.status
        });
      }
    }
    req.send(encodeURIComponent(JSON.stringify(data)));
  }
};

exports.LogEvent = LogEvent;

})(typeof exports === 'undefined'? this : exports);
