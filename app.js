var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	api = require('./api'),
	options = require('./options').options;

if (options.help) {
	options.showHelp();
	process.exit(0);
}

app.use(bodyParser.json())
app.use(logger('dev'));

app.get('/api/device/:id', api.query);
app.post('/api/device', api.register);
app.get('/api/devices', api.devices);
app.post('/api/device/:id/borrower', api.borrowDevice);
app.delete('/api/device/:id/borrower', api.returnDevice);

app.listen(options.port);
console.log('Listening on port ' + options.port);