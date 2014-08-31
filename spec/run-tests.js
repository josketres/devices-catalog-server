var spawn = require('child_process').spawn;
var app = spawn('node', ['./app.js', '--port', '8007']);

// logs process stdout/stderr to the console
function logToConsole(data) {
  console.log(String(data));
}

app.stdout.on('data', logToConsole);
app.stderr.on('data', logToConsole);

var jasmineNodeCmd = (process.platform === "win32" ? "jasmine-node.cmd" : "jasmine-node")
var jasmineNode = spawn(jasmineNodeCmd, ['./spec']);

jasmineNode.stdout.on('data', logToConsole);
jasmineNode.stderr.on('data', logToConsole);

jasmineNode.on('exit', function(exitCode) {
  // when jasmine-node is done, shuts down the application server
  app.kill();
});