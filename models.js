exports.models = {
  "Device": {
    "id": "Device",
    "required": ["id", "name"],
    "properties": {
      "id": {
        "type": "string",
        "description": "Unique device id"
      },
      "name": {
        "type": "string",
        "description": "Name of the device"
      },
      "status": {
        "type": "string",
        "description": "The current status of the device",
        "enum": [
          "available",
          "borrowed"
        ]
      },
      "borrower": {
        "$ref": "Borrower",
        "description": "To whom is the device currently borrowed"
      },
    }
  },
  "Borrower": {
    "id": "Borrower",
    "required": ["name"],
    "properties": {
      "name": {
        "type": "string",
        "description": "Name of the borrower"
      },
    }
  },
};