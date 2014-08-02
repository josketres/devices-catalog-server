var express = require('express'),
app = express(),
api = require('./api'),
bodyParser = require('body-parser'),
logger  = require('morgan');

app.use(bodyParser.json())
app.use(logger('dev')); 

app.get('/api/device/:id', api.query);
app.post('/api/device', api.register);
app.get('/api/devices', api.devices);
app.post('/api/device/:id/borrower', api.borrowDevice);
app.delete('/api/device/:id/borrower', api.returnDevice);

app.listen(8000);
console.log('Listening on port 8000');