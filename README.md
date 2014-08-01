# Devices Catalog Server

## Install & run
    git clone https://github.com/josketres/devices-catalog-server.git
    cd devices-catalog-server
    sudo npm install
    node app.js

## API

### Register device
POST /api/register

### Query device
GET /api/device/:id

### Query all registered devices
GET /api/devices
