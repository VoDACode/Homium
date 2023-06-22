const payload = {
    "/auth/signin": {
        "post": {
            "tags": [
                "/auth"
            ],
            "summary": "Sign in",
            "description": "Sign in to the application",
            "requestBody": {
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/signin"
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "Unauthorized"
                }
            }
        }
    }
}

export default payload;