var Getopt = require('node-getopt');
var getopt = new Getopt([
	['p', 'port=ARG', 'Port for http (default 8080).'],
	['h', 'help', 'display this help']
]);

var opt = getopt.parse(process.argv.slice(2));

exports.options = {
	port: opt.options['port'] || 8080,
	help: opt.options.help,
	showHelp: function() {
		getopt.showHelp();
	}
};