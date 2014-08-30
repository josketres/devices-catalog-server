var fs = require('fs'),
  swe = require("swagger-node-express"),
  url = require("url"),
  param = swe.params;

// initialize our in-memory database
var db = {};
if (fs.existsSync("./backup.js")) {
  console.info('Filling db with backup.js');
  db = require('./backup.js').data;
}

exports.query = {
  'spec': {
    description: "Device catalog management",
    path: "/api/device/{deviceId}",
    method: "GET",
    summary: "Find device by ID",
    notes: "Returns a device based on ID",
    type: "Device",
    nickname: "getDeviceById",
    produces: ["application/json"],
    parameters: [param.path("deviceId", "ID of device that needs to be fetched", "string")],
    responseMessages: [swe.errors.invalid('id'), swe.errors.notFound('device')]
  },
  'action': function(req, res) {
    if (!req.params.deviceId) {
      throw swe.errors.invalid('id');
    }
    var id = req.params.deviceId;
    var device = db[id];

    if (device) {
      res.header("Cache-Control", "no-cache");
      res.send(JSON.stringify(device));
    } else {
      throw swe.errors.notFound('device', res);
    }
  }
};

exports.register = {
  'spec': {
    path: "/api/device",
    method: "POST",
    summary: "Register a new device in the catalog",
    notes: "-",
    type: "Device",
    nickname: "registerDevice",
    produces: ["application/json"],
    parameters: [param.body("Device", "Device object that needs to be added to the catalog", "Device")],
    responseMessages: [swe.errors.invalid('input')]
  },
  'action': function(req, res) {
    var device = req.body;
    if (!device || !device.id) {
      throw swe.errors.invalid('device');
    } else if (db[device.id]) {
      throw swe.errors.invalid('device (already registered)');
    } else {
      device.borrower = undefined;
      device.status = 'available';
      db[device.id] = device;
      res.json(device);
    }
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