const payload = {
    "/api/users/list/": {
        "get": {
            "tags": [
                "users"
            ],
            "summary": "List users",
            "description": "List all users",
            "operationId": "listUsers",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "responses": {
                "200": {
                    "description": "List of users",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/UserView"
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
        },
        "post": {
            "tags": [
                "users"
            ],
            "summary": "Create user",
            "description": "Create a new user",
            "operationId": "createUser",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "requestBody": {
                "description": "User object",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/UserCreate"
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "User created"
                },
                "400": {
                    "description": "Invalid request"
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
    "/api/users/list/{username}": {
        "get": {
            "tags": [
                "users"
            ],
            "summary": "Get user",
            "description": "Get a user by username",
            "operationId": "getUser",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "parameters": [
                {
                    "name": "username",
                    "in": "path",
                    "description": "Username",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "User object",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/UserView"
                            }
                        }
                    }
                },
                "400": {
                    "description": "Invalid request"
                },
                "401": {
                    "description": "Unauthorized"
                },
                "403": {
                    "description": "Permission denied!"
                },
                "404": {
                    "description": "User not found"
                }
            }
        },
        "put": {
            "tags": [
                "users"
            ],
            "summary": "Update user",
            "description": "Update a user by username",
            "operationId": "updateUser",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "parameters": [
                {
                    "name": "username",
                    "in": "path",
                    "description": "Username",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "requestBody": {
                "description": "User object",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/UserUpdate"
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "User updated"
                },
                "400": {
                    "description": "Invalid request"
                },
                "401": {
                    "description": "Unauthorized"
                },
                "403": {
                    "description": "Permission denied!"
                },
                "404": {
                    "description": "User not found"
                }
            }
        },
        "delete": {
            "tags": [
                "users"
            ],
            "summary": "Delete user",
            "description": "Delete a user by username",
            "operationId": "deleteUser",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "parameters": [
                {
                    "name": "username",
                    "in": "path",
                    "description": "Username",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "User deleted"
                },
                "400": {
                    "description": "Invalid request"
                },
                "401": {
                    "description": "Unauthorized"
                },
                "403": {
                    "description": "Permission denied!"
                },
                "404": {
                    "description": "User not found"
                }
            }
        }
    },
    "/api/users/list/{username}/permissions": {
        "get": {
            "tags": [
                "users"
            ],
            "summary": "List user permissions",
            "description": "List all permissions of a user by username",
            "operationId": "listUserPermissions",
            "security": [
                {
                    "bearerAuth": []
                }
            ],
            "parameters": [
                {
                    "name": "username",
                    "in": "path",
                    "description": "Username",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "List of permissions",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ClientPermission/ClientPermissions"
                            }
                        }
                    }
                },
                "400": {
                    "description": "Invalid request"
                },
                "401": {
                    "description": "Unauthorized"
                },
                "403": {
                    "description": "Permission denied!"
                },
                "404": {
                    "description": "User not found"
                }
            }
        }
    },
    "/api/users/templates": {
        "get": {
            "tags": [
                "users"
            ],
            "summary": "List user templates",
            "description": "List all user templates",
            "operationId": "listUserTemplates",
            "responses": {
                "200": {
                    "description": "List of user templates",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ClientPermission/Templates"
                            }
                        }
                    }
                }
            }
        }
    }
};
export default payload;