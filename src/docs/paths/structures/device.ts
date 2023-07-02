const payload = {
    "/api/structures/:sectorName/:sectionName" : {
        "get" : {
            "tags" : [
                "structures"
            ],
            "security" : [
                {
                    "bearerAuth" : [ ]
                }
            ],
            "summary" : "Get all devices in a section",
            "description" : "Get all devices in a section",
            "operationId" : "getDevices",
            "parameters" : [
                {
                    "name" : "sectorName",
                    "in" : "path",
                    "description" : "Sector name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                },
                {
                    "name" : "sectionName",
                    "in" : "path",
                    "description" : "Section name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                }
            ],
            "responses" : {
                "200" : {
                    "description" : "OK",
                    "content" : {
                        "application/json" : {
                            "schema" : {
                                "type" : "array",
                                "items" : {
                                    "$ref" : "#/components/schemas/Structures/views/Device"
                                }
                            }
                        }
                    }
                },
                "400" : {
                    "description" : "Bad Request",
                },
                "401" : {
                    "description" : "Unauthorized",
                },
                "403" : {
                    "description" : "Permission denied",
                }
            }
        },
        "post" : {
            "tags" : [
                "structures"
            ],
            "security" : [
                {
                    "bearerAuth" : [ ]
                }
            ],
            "summary" : "Create a new device in a section",
            "description" : "Create a new device in a section",
            "operationId" : "createDevice",
            "parameters" : [
                {
                    "name" : "sectorName",
                    "in" : "path",
                    "description" : "Sector name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                },
                {
                    "name" : "sectionName",
                    "in" : "path",
                    "description" : "Section name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                }
            ],
            "requestBody" : {
                "description" : "Device to create",
                "content" : {
                    "application/json" : {
                        "schema" : {
                            "$ref" : "#/components/schemas/Structures/views/Device"
                        }
                    }
                },
                "required" : true
            },
            "responses" : {
                "201" : {
                    "description" : "Created",
                },
                "400" : {
                    "description" : "Bad Request",
                },
                "401" : {
                    "description" : "Unauthorized",
                },
                "403" : {
                    "description" : "Permission denied",
                }
            }
        },
        "put" : {
            "tags" : [
                "structures"
            ],
            "security" : [
                {
                    "bearerAuth" : [ ]
                }
            ],
            "summary" : "Update a device",
            "description" : "Update a device",
            "operationId" : "updateDevice",
            "parameters" : [
                {
                    "name" : "sectorName",
                    "in" : "path",
                    "description" : "Sector name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                },
                {   
                    "name" : "sectionName",
                    "in" : "path",
                    "description" : "Section name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                },
                {
                    "name" : "target",
                    "in" : "query",
                    "description" : "Device name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                }
            ],
            "requestBody" : {
                "description" : "Device to update",
                "content" : {
                    "application/json" : {
                        "schema" : {
                            "$ref" : "#/components/schemas/Structures/views/Device"
                        }
                    }
                },
                "required" : true
            },
            "responses" : {
                "200" : {
                    "description" : "OK",
                },
                "400" : {
                    "description" : "Bad Request",
                },
                "401" : {
                    "description" : "Unauthorized",
                },
                "403" : {
                    "description" : "Permission denied",
                }
            }
        },
        "delete" : {
            "tags" : [
                "structures"
            ],
            "security" : [
                {
                    "bearerAuth" : [ ]
                }
            ],
            "summary" : "Delete a device",
            "description" : "Delete a device",
            "operationId" : "deleteDevice",
            "parameters" : [
                {
                    "name" : "sectorName",
                    "in" : "path",
                    "description" : "Sector name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                },
                {
                    "name" : "sectionName",
                    "in" : "path",
                    "description" : "Section name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                },
                {
                    "name" : "target",
                    "in" : "path",
                    "description" : "Device name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                }
            ],
            "responses" : {
                "200" : {
                    "description" : "OK",
                },
                "400" : {
                    "description" : "Bad Request",
                },
                "401" : {
                    "description" : "Unauthorized",
                },
                "403" : {
                    "description" : "Permission denied",
                }
            }
        }
    },

    "/api/structures/:sectorName/:sectionName/:deviceName" : {
        "post" : {
            "tags" : [
                "structures"
            ],
            "security" : [
                {
                    "bearerAuth" : [ ]
                }
            ],
            "summary" : "Set a device property value",
            "description" : "Set a device property value",
            "operationId" : "setDeviceProperty",
            "parameters" : [
                {
                    "name" : "sectorName",
                    "in" : "path",
                    "description" : "Sector name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                },
                {
                    "name" : "sectionName",
                    "in" : "path",
                    "description" : "Section name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                },
                {
                    "name" : "deviceName",
                    "in" : "path",
                    "description" : "Device name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                },
                {
                    "name" : "property",
                    "in" : "query",
                    "description" : "Property name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                },
                {
                    "name" : "value",
                    "in" : "query",
                    "description" : "Property value",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                }
            ],
            "responses" : {
                "200" : {
                    "description" : "OK",
                },
                "400" : {
                    "description" : "Bad Request",
                },
                "401" : {
                    "description" : "Unauthorized",
                },
                "403" : {
                    "description" : "Permission denied",
                }
            }
        }
    }

};
export default payload;