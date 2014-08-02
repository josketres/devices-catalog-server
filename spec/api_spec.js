var frisby = require('frisby');

var URL = 'http://localhost:8000/';

frisby.create('Register device without id should result in a bad request')
  .post(URL + 'api/device', {
    name : 'myDevice'
  }, { json : true})
  .expectStatus(400)
  .inspectBody()
.toss();

frisby.create('Register device with id x001')
  .post(URL + 'api/device', {
    id : 'x001'
  }, { json : true})
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSON({
    id : 'x001',
    status : 'available'
  })
.toss();

frisby.create('Register device with id x001 again should result in an error')
  .post(URL + 'api/device', {
    id : 'x001'
  }, { json : true})
  .expectStatus(500)
  .inspectBody()
.toss();

frisby.create('Query device with id x001')
  .get(URL + 'api/device/x001')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectHeaderContains('cache-control', 'no-cache')
  .expectJSON({
    id : 'x001',
    status : 'available'
  })
.toss();

frisby.create('Query device with unregistered id should result in a 404-NotFound')
  .get(URL + 'api/device/x999')
  .expectStatus(404)
  .inspectBody()
.toss();

frisby.create('Query list of registered devices')
  .get(URL + 'api/devices')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectHeaderContains('cache-control', 'no-cache')
  .expectJSON({
    'x001' : {
      id : 'x001',
      status : 'available'
    }
  })
.toss();

frisby.create('Borrow device x001 to Josue')
  .post(URL + 'api/device/x001/borrower', {
    name : 'Josue'
  }, { json : true})
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes({
    id : String,
    status : String,
    borrower : {
      name : String
    },
    borrowedSince : Number
  })
  .expectJSON({
    id : 'x001',
    status : 'borrowed',
    borrower : {
      name : 'Josue'
    },
    borrowedSince : function(val) { expect(val).toBeDefined(); }
  })
  .inspectJSON()
.toss();

frisby.create('Borrow device x001 to a borrower without name should result in a bad request')
  .post(URL + 'api/device/x001/borrower', {
    lastName : 'Zarzosa'
  }, { json : true})
  .expectStatus(400)
  .inspectBody()
.toss();

frisby.create('Borrow unregistered device should result in a 404-NotFound')
  .post(URL + 'api/device/x999/borrower', {
    name : 'Josue'
  }, { json : true})
  .expectStatus(404)
  .inspectBody()
.toss();

frisby.create('Return device x001 (make it available)')
  .delete(URL + 'api/device/x001/borrower', {
    name : 'Josue'
  }, { json : true})
  .expectStatus(200)
  .expectJSON({
    id : 'x001',
    status : 'available',
  })
.toss();

frisby.create('Return unregistered device should result in a 404-NotFound')
  .delete(URL + 'api/device/x999/borrower', {
    name : 'Josue'
  }, { json : true})
  .expectStatus(404)
  .inspectBody()
.toss();
