// initialize our in-memory database
var db = [];

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
  var id = db.length, 
  device = req.body;
  device.id = id;
  db.push(device);
  res.json(db[id]);
};

exports.devices = function(req, res) {
  res.json(db);
};