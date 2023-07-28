const payload = {
    "/api/object/list": {
        "get": {
            "tags": [
                "object"
            ],
            "summary": "List objects",
            "description": "List objects",
            "operationId": "listObjects",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "parameters": [
                {
                    "name": "viewProperties",
                    "in": "query",
                    "description": "View properties",
                    "required": false,
                    "schema": {
                        "type": "boolean",
                        "default": false
                    }
                },
                {
                    "name": "viewType",
                    "in": "query",
                    "description": "View type",
                    "required": false,
                    "schema": {
                        "type": "boolean",
                        "default": false
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Objects listed",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Object/ListObjects"
                            }
                        }
                    }
                },
                "403": {
                    "description": "Permission denied!"
                }
            }
        }
    },
    "/api/object/list/ids": {
        "get": {
            "tags": [
                "object"
            ],
            "summary": "List object ids",
            "description": "List object ids",
            "operationId": "listObjectIds",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "responses": {
                "200": {
                    "description": "Object ids listed",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized!"
                },
                "403": {
                    "description": "Permission denied!"
                }
            }
        }
    },
    "/api/object/list/{id}": {
        "get": {
            "tags": [
                "object"
            ],
            "summary": "List object",
            "description": "List object",
            "operationId": "listObject",
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

                    "name": "viewProperties",
                    "in": "query",
                    "description": "View properties",
                    "required": false,
                    "schema": {
                        "type": "boolean",
                        "default": false
                    }
                },
                {
                    "name": "viewType",
                    "in": "query",
                    "description": "View type",
                    "required": false,
                    "schema": {
                        "type": "boolean",
                        "default": false
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Object listed",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Object/ListObject"
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized!"
                },
                "403": {
                    "description": "Permission denied!"
                }
            }
        }
    }
};

export default payload;