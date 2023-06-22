const payload = {
    "/api/object/remove/{id}": {
        "delete": {
            "tags": [
                "/api/object"
            ],
            "summary": "Remove object",
            "description": "Remove object",
            "operationId": "removeObject",
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
            "responses": {
                "200": {
                    "description": "Object removed"
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