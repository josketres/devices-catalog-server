var sw = require("swagger-node-express"),
  swe = sw.errors,
  param = sw.params,
  url = require("url"),
  service = require("./service.js");

exports.query = {
  'spec': {
    description: "Device catalog management",
    path: "/api/device/{deviceId}",
    method: "GET",
    summary: "Find device by ID",
    notes: "Fetches a device based on ID",
    type: "Device",
    nickname: "getDeviceById",
    produces: ["application/json"],
    parameters: [param.path("deviceId", "ID of device that needs to be fetched", "string")],
    responseMessages: [swe.invalid('id'), swe.notFound('device')]
  },
  'action': function(req, res) {
    if (!req.params.deviceId) {
      throw swe.invalid('id');
    }
    var id = req.params.deviceId;
    var device = service.findById(id);
    if (device) {
      res.header("Cache-Control", "no-cache");
      res.send(JSON.stringify(device));
    } else {
      throw swe.notFound('device', res);
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
    responseMessages: [swe.invalid('input')]
  },
  'action': function(req, res) {
    var device = req.body;
    if (!device || !device.id) {
      throw swe.invalid('device');
    } else if (service.findById(device.id)) {
      throw swe.invalid('device (already registered)');
    } else {
      service.register(device);
      res.json(device);
    }
  }
};

exports.borrowDevice = {
  'spec': {
    path: "/api/device/{deviceId}/borrower",
    method: "POST",
    summary: "Borrows a device to the given borrower",
    notes: "-",
    type: "Borrower",
    nickname: "borrowDevice",
    produces: ["application/json"],
    parameters: [
      param.path("deviceId", "ID of device that needs to be borrowed", "string"),
      param.body("Borrower", "Borrower to whom the device will be borrowed.", "Borrower")
    ],
    responseMessages: [swe.invalid('input'), swe.invalid('id'), swe.notFound('device')]
  },
  'action': function(req, res) {
    if (!req.params.deviceId) {
      throw swe.invalid('id');
    }

    var deviceId = req.params.deviceId,
      device = service.findById(deviceId);
    if (!device) {
      throw swe.notFound('device');
    }

    var borrower = req.body;
    if (!borrower || !borrower.name) {
      throw swe.invalid('borrower');
    } else {
      service.borrow(device, borrower);
      res.json(device);
    }
  }
};

exports.returnDevice = {
  'spec': {
    path: "/api/device/{deviceId}/borrower",
    method: "DELETE",
    summary: "Return a borrowed device by ID",
    notes: "Changes the status of a device from 'borrowed' to 'available' based on ID",
    type: "Device",
    nickname: "returnBorrowedDevice",
    produces: ["application/json"],
    parameters: [param.path("deviceId", "ID of device that needs to be returned", "string")],
    responseMessages: [swe.invalid('id'), swe.notFound('device')]
  },
  'action': function(req, res) {
    if (!req.params.deviceId) {
      throw swe.invalid('id');
    }
    var id = req.params.deviceId;
    var device = service.findById(id);
    if (device) {
      service.returnBorrowedDevice(device);
      res.json(device);
    } else {
      throw swe.notFound('device', res);
    }
  }
};

exports.devices = {
  'spec': {
    path: "/api/devices",
    method: "GET",
    summary: "Get a list of all registered devices",
    notes: "-",
    type: "array",
    items: {
      $ref: "Device"
    },
    nickname: "getDevices",
    produces: ["application/json"]
  },
  'action': function(req, res) {
    res.header("Cache-Control", "no-cache");
    res.header("Access-Control-Allow-Origin", "*");
    res.json(service.getDevices());
  }
};