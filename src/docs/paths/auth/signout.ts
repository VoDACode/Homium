const payload = {
    "/api/auth/signout": {
        "post": {
            "tags": [
                "/auth"
            ],
            "summary": "Sign out",
            "description": "Sign out of the application",
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