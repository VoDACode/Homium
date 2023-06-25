const payload = {
    "/api/object/update/{id}/object": {
        "put": {
            "tags": [
                "/api/object"
            ],
            "summary": "Update object property",
            "description": "Update object property. If removeCascade is true, the removal will be applied to all children.",
            "operationId": "updateObjectProperty",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Object id",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "removeCascade",
                    "in": "query",
                    "description": "Remove cascade",
                    "required": false,
                    "schema": {
                        "type": "boolean",
                        "default": false
                    }
                }
            ],
            "requestBody": {
                "description": "Object property. Accepts a list of parameters to be added or removed from object.",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Object/ObjectProperty"
                            }
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "Object updated"
                },
                "400": {
                    "description": "Bad request"
                },
                "401": {
                    "description": "Unauthorized"
                },
                "403": {
                    "description": "Permission denied!"
                },
                "404": {
                    "description": "Object not found"
                }
            }
        }
    },
    "/api/object/update/{id}/": {
        "put": {
            "tags": [
                "/api/object"
            ],
            "summary": "Update object",
            "description": "Update object",
            "operationId": "updateObject",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Object id",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "requestBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Object/UpdateObject"
                        }
                    }
                }
            },
            "required": true
        },
        "responses": {
            "200": {
                "description": "Object updated"
            },
            "400": {
                "description": "Bad request"
            },
            "401": {
                "description": "Unauthorized"
            },
            "403": {
                "description": "Permission denied!"
            },
            "404": {
                "description": "Object not found"
            }
        }
    }
};

export default payload;