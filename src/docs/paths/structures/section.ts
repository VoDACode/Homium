const payload = {
    "/api/structures/:sectorName" : {
        "get" : {
            "tags" : [
                "structures"
            ],
            "security" : [
                {
                    "bearerAuth" : [ ]
                }
            ],
            "summary" : "Get all sections in a sector",
            "description" : "Get all sections in a sector",
            "operationId" : "getSections",
            "parameters" : [
                {
                    "name" : "sectorName",
                    "in" : "path",
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
                    "content" : {
                        "application/json" : {
                            "schema" : {
                                "type" : "array",
                                "items" : {
                                    "$ref" : "#/components/schemas/Structures/views/Section"
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
            "summary" : "Create a new section in a sector",
            "description" : "Create a new section in a sector",
            "operationId" : "createSection",
            "parameters" : [
                {
                    "name" : "sectorName",
                    "in" : "path",
                    "description" : "Sector name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                }
            ],
            "requestBody" : {
                "description" : "Section object",
                "content" : {
                    "application/json" : {
                        "schema" : {
                            "$ref" : "#/components/schemas/Structures/views/Section"
                        }
                    }
                }
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
            "summary" : "Update a section in a sector",
            "description" : "Update a section in a sector",
            "operationId" : "updateSection",
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
                    "name" : "target",
                    "in" : "query",
                    "description" : "Section name",
                    "required" : true,
                    "schema" : {
                        "type" : "string"
                    }
                }
            ],
            "requestBody" : {
                "description" : "Section object",
                "content" : {
                    "application/json" : {
                        "schema" : {
                            "$ref" : "#/components/schemas/Structures/views/Section"
                        }
                    }
                }
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
            "summary" : "Delete a section in a sector",
            "description" : "Delete a section in a sector",
            "operationId" : "deleteSection",
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
                    "name" : "target",
                    "in" : "query",
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