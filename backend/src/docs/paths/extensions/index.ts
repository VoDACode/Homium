const payload = {
    "/api/extensions": {
        "get": {
            "tags": [
                "extensions"
            ],
            "summary": "Get all installed extensions",
            "description": "Get all installed extensions",
            "responses": {
                "200": {
                    "description": "OK",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/ExtensionInfo"
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized"
                },
                "403": {
                    "description": "Permission denied"
                }
            }
        }
    },
    "/api/extensions/{id}": { 
        "get": {
            "tags": [
                "extensions"
            ],
            "summary": "Get extension info",
            "description": "Get extension info",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Extension ID",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "OK",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ExtensionInfo"
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized"
                },
                "403": {
                    "description": "Permission denied"
                },
                "404": {
                    "description": "Extension not found"
                }
            }
        }
    },
    "/api/extensions/{id}/events": {
        "get": {
            "tags": [
                "extensions"
            ],
            "summary": "Get extension events",
            "description": "This events are implemented by the extension and can be used by other extensions or scripts",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Extension ID",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                }
            ],
            "responses": {
                "200": {
                    "description": "OK",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "name": {
                                            "type": "string"
                                        },
                                        "description": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {
                    "description": "Unauthorized"
                },
                "403": {
                    "description": "Permission denied"
                },
                "404": {
                    "description": "Extension not found"
                }
            }
        }
    }
};

export default payload;