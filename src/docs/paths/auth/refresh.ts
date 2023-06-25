const payload = {
    "/api/auth/refresh": {
        "post": {
            "tags": [
                "/auth"
            ],
            "summary": "Refresh",
            "description": "Refresh the access token",
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