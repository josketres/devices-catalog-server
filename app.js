var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
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
	.addGet(resources.devices)
	.addPost(resources.register)
	.addPost(resources.borrowDevice)
	.addDelete(resources.returnDevice);

app.get('/', function(req, res) {
	res.redirect('/swagger-ui/index.html');
});

swagger.configureSwaggerPaths("", "api-docs", "");
swagger.configure("http://" + options.hostName + ":" + options.port, "0.1");

app.use(function(err, req, res, next) {
	res.status(err.code).send(err.message);
});

app.listen(options.port);
console.log('Listening on port ' + options.port);