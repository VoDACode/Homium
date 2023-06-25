const payload = {
    "/api/auth/status": {
        "get": {
            "tags": [
                "/auth"
            ],
            "summary": "Status",
            "description": "Get the status of the current session",
            "responses": {
                "200": {
                    "description": "Token is valid"
                },
                "401": {
                    "description": "Unauthorized"
                }
            }
        }
    }
}

export default payload;