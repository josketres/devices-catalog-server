var fs = require('fs');

// initialize our in-memory database
var db = {};
if (fs.existsSync("./backup.js")) {
  console.info('Filling db with backup.js');
  db = require('./backup.js').data;
}

exports.query = function(req, res) {
  var id = req.params.id,
    data = db[id];
  if (!data) {
    console.log("No data for id:" + id);
    res.status(404).send('Not found');
  } else {
    res.header("Cache-Control", "no-cache");
    res.json(data);
  }
};

exports.register = function(req, res) {
  var device = req.body;

  if (!device.id) {
    res.status(400).send("Can't register a device without 'id'");
  } else if (db[device.id]) {
    res.status(500).send("Device is already registered");
  } else {
    device.borrower = undefined;
    device.status = 'available';
    db[device.id] = device;
    res.json(device);
  }
};

exports.borrowDevice = function(req, res) {
  var id = req.params.id,
    device = db[id],
    borrower = req.body;

  if (!device) {
    console.log("No device found for id:" + id);
    res.status(404).send('Not found');
  } else if (!borrower['name']) {
    res.status(400).send("Can't borrow to a borrower without 'name'");
  } else {
    device.borrower = borrower;
    device.borrowedSince = new Date().getTime();
    device.status = 'borrowed';
    res.json(device);
  }
};

exports.returnDevice = function(req, res) {
  var id = req.params.id,
    device = db[id];

  if (!device) {
    console.log("No device found for id:" + id);
    res.status(404).send('Not found');
  } else {
    device.borrower = undefined;
    device.borrowedSince = undefined;
    device.status = 'available';
    res.json(device);
  }
};

exports.devices = function(req, res) {
  res.header("Cache-Control", "no-cache");
  res.header("Access-Control-Allow-Origin", "*");
  res.json(db);
};