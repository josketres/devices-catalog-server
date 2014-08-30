var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	api = require('./api'),
	options = require('./options').options,
	swagger = require("swagger-node-express"),
	models = require('./models.js'),
	resources = require('./resources.js');

if (options.help) {
	options.showHelp();
	process.exit(0);
}

app.use(bodyParser.json())
app.use(logger('dev'));
app.use('/swagger-ui', express.static(__dirname + '/swagger-ui'));

swagger.setAppHandler(app);
swagger.addModels(models)
	.addGet(resources.query)
	.addPost(resources.register);

//app.get('/api/device/:id', api.query);
//app.post('/api/device', api.register);
//app.get('/api/devices', api.devices);
//app.post('/api/device/:id/borrower', api.borrowDevice);
//app.delete('/api/device/:id/borrower', api.returnDevice);

swagger.configureSwaggerPaths("", "api-docs", "");
swagger.configure("http://localhost:" + options.port, "0.1");

app.listen(options.port);
console.log('Listening on port ' + options.port);