const payload = {
    "/api/object/create": {
        "post": {
            "tags": [
                "/api/object"
            ],
            "summary": "Create a new Object",
            "description": "Create a new Object",
            "operationId": "createObject",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "requestBody": {
                "description": "Object to create",
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/Object/CreateObject"
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Object created successfully",
                    "content": {
                        "text/plain": {
                            "schema": {
                                "type": "string",
                                "description": "Object ID",
                                "example": "d290f1ee-6c54-4b01-90e6-d701748f0851"
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
            }
        }
    }
};

export default payload;
