const payload = {
    "Structures": {
        "views": {
            "Sector": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Sector name",
                        "required": true,
                        "minLength": 1,
                        "unique": true
                    },
                    "description": {
                        "type": "string",
                        "description": "Sector description",
                        "required": false,
                        "default": ""
                    },
                    "sectorType": {
                        "type": "string",
                        "description": "Sector type",
                        "required": false,
                        "default": "house"
                    },
                    "aliases": {
                        "type": "array",
                        "description": "Sector aliases",
                        "required": false,
                        "items": {
                            "type": "string"
                        }
                    },
                    "isDefault": {
                        "type": "boolean",
                        "description": "Is this sector the default one?",
                        "required": false,
                        "default": false
                    }
                }
            },
            "Section": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Section name",
                        "required": true,
                        "minLength": 1,
                        "unique": true
                    },
                    "description": {
                        "type": "string",
                        "description": "Section description",
                        "required": false,
                    },
                    "aliases": {
                        "type": "array",
                        "description": "Section aliases",
                        "required": false,
                        "items": {
                            "type": "string"
                        }
                    }
                }
            },
            "Device": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Device name",
                        "required": true,
                        "minLength": 1
                    },
                    "description": {
                        "type": "string",
                        "description": "Device description",
                        "required": false,
                    },
                    "aliases": {
                        "type": "array",
                        "description": "Device aliases",
                        "required": false,
                        "items": {
                            "type": "string"
                        }
                    },
                    "type": {
                        "type": "string",
                        "description": "Device type",
                        "required": true,
                    },
                    "properties": {
                        "type": "array",
                        "description": "Device properties",
                        "required": false,
                        "items": {
                            "$ref": "#/components/schemas/Structures/views/DeviceProperty"
                        }
                    }   
                }
            },
            "DeviceProperty": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Property name",
                        "required": true,
                        "minLength": 1
                    },
                    "description": {
                        "type": "string",
                        "description": "Property description",
                        "required": false,
                    },
                    "aliases": {
                        "type": "array",
                        "description": "Property aliases",
                        "required": false,
                        "items": {
                            "type": "string"
                        }
                    },
                    "objectId": {
                        "type": "string",
                        "description": "Object ID",
                        "required": true,
                    },
                    "objectProperty": {
                        "type": "string",
                        "description": "Reference to the property in the object",
                        "required": true,
                    },
                    "value": {
                        "type": "string",
                        "description": "Property value",
                        "required": true,
                    }
                }
            }
        }
    }
};
export default payload;