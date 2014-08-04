# Devices Catalog Server

## Install & run
    git clone https://github.com/josketres/devices-catalog-server.git
    cd devices-catalog-server
    npm install
    node app.js

## API
See the specs under `spec/` for examples of the API calls.

### Register device
POST /api/register

### Query device
GET /api/device/:id

### Query all registered devices
GET /api/devices

### Borrow device
POST /api/device/:id/borrower

### Return device (make it available)
DELETE /api/device/:id/borrower

## Running specs
Specs are created using frisby, which requires jasmine-node for the tests to be run.
    
    sudo npm install -g jasmine-node
    jasmine-node spec/
