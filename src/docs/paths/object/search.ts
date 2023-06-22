const payload = {
    "/api/object/search": {
        "get": {
            "tags": [
                "/api/object"
            ],
            "summary": "Search object",
            "description": "Search object",
            "operationId": "searchObject",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "parameters": [
                {
                    "name": "query",
                    "in": "query",
                    "description": "Search query",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "Search results",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/Object/SearchObjectResult"
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
                    "description": "Permission denied"
                }
            }
        }
    }
};
export default payload;