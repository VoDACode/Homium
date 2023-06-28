const payload = {
    "/api/object/get-root/": {
        "get": {
            "tags": [
                "/api/object"
            ],
            "summary": "Get root objects",
            "description": "Get root objects",
            "operationId": "getRootObjects",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "responses": {
                "200": {
                    "description": "List of objects",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "example": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
                                    "description": "Object ID"
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized"
                },
                "403": {
                    "description": "Permission denied!"
                }
            }
        }
    },
    "/api/object/get/{id}/": {
        "get": {
            "tags": [
                "/api/object"
            ],
            "summary": "Get object property",
            "description": "Get object property",
            "operationId": "getObjectProperty",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Object ID",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "example": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Object",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "PROPERTY_NAME1": {
                                        "type": "string",
                                        "example": "PROPERTY_VALUE1",
                                    },
                                    "PROPERTY_NAME2": {
                                        "type": "string",
                                        "example": "PROPERTY_VALUE2",
                                    },
                                }
                            }
                        }
                    }
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
    "/api/object/get/{id}/children": {
        "get": {
            "tags": [
                "/api/object"
            ],
            "summary": "Get object children",
            "description": "Get object children",
            "operationId": "getObjectChildren",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Object ID",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "example": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "List of objects",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "example": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
                                    "description": "Object ID"
                                }
                            }
                        }
                    }
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
    "/api/object/get/{id}/{prop}/history": {
        "get": {
            "tags": [
                "/api/object"
            ],
            "summary": "Get object property history",
            "description": "Get object property history",
            "operationId": "getObjectPropertyHistory",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Object ID",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "example": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
                    }
                },
                {
                    "name": "prop",
                    "in": "path",
                    "description": "Object property",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "example": "PROPERTY_NAME"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "List of object property history",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "current": {
                                        "type": "string",
                                        "example": "PROPERTY_VALUE",
                                    },
                                    "history": {
                                        "type": "array",
                                        "items": {
                                            "$ref": "#/components/schemas/Object/ObjectPropertyHistory"
                                        }
                                    }
                                }
                            }
                        }
                    }
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
    "/api/object/set/{id}/": {
        "get": {
            "tags": [
                "/api/object"
            ],
            "summary": "Set object property",
            "description": "Set object property",
            "operationId": "setObjectProperty",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Object ID",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "example": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
                    }
                },
                {
                    "name": "key",
                    "in": "query",
                    "description": "Object property",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "example": "PROPERTY_NAME"
                    }
                },
                {
                    "name": "value",
                    "in": "query",
                    "description": "Object property value",
                    "required": true,
                    "schema": {
                        "type": "string",
                        "example": "PROPERTY_VALUE"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Object",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "PROPERTY_NAME1": {
                                        "type": "string",
                                        "example": "PROPERTY_VALUE1",
                                    },
                                    "PROPERTY_NAME2": {
                                        "type": "string",
                                        "example": "PROPERTY_VALUE2",
                                    },
                                }
                            }
                        }
                    }
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
    }
}

export default payload;