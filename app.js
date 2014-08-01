var express = require('express');
var app = express();
var api = require('./api');

app.use(express.bodyParser());
app.use(express.logger());

app.get('/api/device/:id', api.query);
app.post('/api/device', api.register);
app.get('/api/devices', api.devices);

app.listen(8000);
console.log('Listening on port 8000');