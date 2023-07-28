const payload = {
    "/api/structures/" : {
        "get" : {
            "tags" : [
                "structures"
            ],
            "security" : [
                {
                    "bearerAuth" : [ ]
                }
            ],
            "summary" : "Get all sectors",
            "description" : "Get all sectors",
            "operationId" : "getSectors",
            "responses" : {
                "200" : {
                    "description" : "OK",
                    "content" : {
                        "application/json" : {
                            "schema" : {
                                "type" : "array",
                                "items" : {
                                    "$ref" : "#/components/schemas/Structures/views/Sector"
                                }
                            }
                        }
                    }
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
            "summary" : "Create a new sector",
            "description" : "Create a new sector",
            "operationId" : "createSector",
            "requestBody" : {
                "description" : "Sector object",
                "content" : {
                    "application/json" : {
                        "schema" : {
                            "$ref" : "#/components/schemas/Structures/views/Sector"
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
            "summary" : "Update a sector",
            "description" : "Update a sector",
            "operationId" : "updateSector",
            "parameters" : [
                {
                    "name" : "target",
                    "in" : "query",
                    "description" : "Sector name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                }
            ],
            "requestBody" : {
                "description" : "Sector object",
                "content" : {
                    "application/json" : {
                        "schema" : {
                            "$ref" : "#/components/schemas/Structures/views/Sector"
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
            "summary" : "Delete a sector",
            "description" : "Delete a sector",
            "operationId" : "deleteSector",
            "parameters" : [
                {
                    "name" : "target",
                    "in" : "query",
                    "description" : "Sector name",
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