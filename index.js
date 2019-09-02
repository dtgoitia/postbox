const express = require('express');
const bodyParser = require('body-parser');
require('./config.js');

const u = require('util');

function sortDictByKey(dictionary) {
  const unsorted = [];
  for (let headerKey in dictionary) {
    unsorted.push({ key: headerKey, value: dictionary[headerKey] });
  }
  return unsorted.sort((a, b) => {
    return a.key.toUpperCase() < b.key.toUpperCase() ? -1 : 1;
  });
}

function getResponseHeaders(response) {
  return RESPONSE_HEADERS
    .map(headerKey => {
      const headerValue = response.get(headerKey);
      return headerValue !== null && headerValue !== undefined
        ? { key: headerKey, value: headerValue }
        : null
    })
    .filter(x => x !== null);
}

function handleIncomingRequest(request) {
  const headers = sortDictByKey(request.headers)
  logMsg = 'HEADERS\n';
  logMsg += headers.map(header => `  ${header.key}: ${header.value}`).join('\n');
  logMsg += '\nBODY';
  logMsg += request.rawBody === undefined ? '' : request.rawBody;
  return logMsg;
}


function handleOutgoingResponse(request, response) {
  body = '';
  if (request.originalUrl == '/xml') {
    response.type('text/xml');
    body = XML_DEFAULT_RESPONSE_BODY;
  } else {
    response.type('application/json');
    body = JSON.stringify(JSON_DEFAULT_RESPONSE_BODY);
  }
  response.send(body);

  logMsg = 'HEADERS\n';
  logMsg += getResponseHeaders(response)
    .map(header => `  ${header.key}: ${header.value}`)
    .join('\n');
  logMsg += '\nBODY';
  logMsg += `\n${body}`;
  return logMsg;
}

function logRequestAndResponse(req, res) {
  logMsg = '\n\n\n------------------------------------------------------ ';
  logMsg += `${(new Date()).toISOString()}\n${req.method} request received\n\n`;
  logMsg += handleIncomingRequest(req);
  logMsg += '\n\n-------------  see response below  -------------\n\n';
  logMsg += handleOutgoingResponse(req, res);
  logMsg += '\n';
  console.log(logMsg);
}

// Create a new instance of express
const app = express();

// Setup body-parser to parse HTTP body as raw
const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) req.rawBody = buf.toString(encoding || 'utf8');
}
app.use(bodyParser.raw({ verify: rawBodySaver, type: () => true }));

// Setup routes
app.get( '/',    (req, res) => logRequestAndResponse(req, res));
app.get( '/xml', (req, res) => logRequestAndResponse(req, res));
app.post('/',    (req, res) => logRequestAndResponse(req, res));
app.post('/xml', (req, res) => logRequestAndResponse(req, res));
app.put( '/',    (req, res) => logRequestAndResponse(req, res));
app.put( '/xml', (req, res) => logRequestAndResponse(req, res));

// Listen on PORT port
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server started. Listening on http://localhost:${PORT}`)
});