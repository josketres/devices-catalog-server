var fs = require('fs');

// initialize our in-memory database
var db = {};
if (fs.existsSync("./backup.js")) {
	console.info('Filling db with backup.js');
	db = require('./backup.js').data;
}

exports.findById = function(id) {
	return db[id];
};

exports.register = function(device) {
	device.borrower = undefined;
	device.status = 'available';
	db[device.id] = device;
};

exports.getDevices = function() {
	return db;
};

exports.returnBorrowedDevice = function(device) {
	device.borrower = undefined;
	device.borrowedSince = undefined;
	device.status = 'available';
};

exports.borrow = function(device, borrower) {
	device.borrower = borrower;
	device.borrowedSince = new Date().getTime();
	device.status = 'borrowed';
};