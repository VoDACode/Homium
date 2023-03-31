# API: Bot

## APIs

### GET `/api/bot/list`

Get the list of bots.

#### Request

None.

#### Response

    200 OK
    401 Unauthorized
    403 Forbidden

#### Example

    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/bot/list

### GET `/api/bot/list/:id`

Get the bot by id.

#### Request

#### URL Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | `string` | The id of the bot |

#### Response

    200 OK
    401 Unauthorized
    403 Forbidden

#### Example

    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/bot/list/5a9b1b9b0f1b9c0001b5b0b0

### POST `/api/bot/create`

Create a new bot.

#### Request

#### Body Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | `string` | The name of the bot |
| description | `string` | The description of the bot |
| isActivated | `boolean` | The activation status of the bot |
| permissions | [`ClientPermissions`](/src/models/ClientPermissions.ts) | The permissions of the bot |

#### Response

    201 Created
    400 Bad Request (and error message in body)
    401 Unauthorized
    403 Forbidden

### GET `/api/bot/getApiKey/:id`

Get the API key of the bot by id.

#### Request

#### URL Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | `string` | The id of the bot |

#### Response

    200 OK (and API key in body)
    401 Unauthorized
    403 Forbidden
    404 Not Found

#### Example

    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/bot/getApiKey/12345678-1234-1234-qwer-123456qwerty

### PUT `/api/bot/regenerate/:id`

Regenerate the API key of the bot by id.

#### Request

#### URL Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | `string` | The id of the bot |

#### Response

    201 OK (and new API key in body)
    400 Bad Request (and error message in body)
    401 Unauthorized
    403 Forbidden
    404 Not Found

#### Example

    curl -i 
    -X PUT
    -H "Content-Type: application/json"
    http://localhost:3000/api/bot/regenerate/12345678-1234-1234-qwer-123456qwerty

### PUT `/api/bot/update`

#### Request

#### Body Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| id | `string` | Yes | The id of the bot |
| name | `string` | No | The name of the bot |
| description | `string` | No | The description of the bot |
| isActivated | `boolean` | No | The activation status of the bot |
| permissions | [`ClientPermissions`](/src/models/ClientPermissions.ts) | No | The permissions of the bot |

#### Response

    200 OK (and updated bot in body)
    400 Bad Request (and error message in body)
    401 Unauthorized
    403 Forbidden
    404 Not Found

### DELETE `/api/bot/delete`

Delete the bot by id.

#### Request

#### Body Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | `string` | The id of the bot |

#### Response

    200 OK (and deleted bot id in body)
    400 Bad Request (and error message in body)
    401 Unauthorized
    403 Forbidden
    404 Not Found

#### Example

    curl -i 
    -X DELETE
    -H "Content-Type: application/json"
    http://localhost:3000/api/bot/delete
    -d '{"id": "12345678-1234-1234-qwer-123456qwerty"}'

## Authentication

If you need to use the API from the bot client, you need to specify your API key in the `x-api-key` field in the request header.

For exapmle:

    curl -i 
    -X GET
    -H "Content-Type: application/json"
    -H "x-api-key: 12345678-1234-1234-qwer-123456qwerty"
    http://localhost:3000/api/object/get/[object_id]

This request will return the object with the specified id.

### GET `/api/bot/oath2/token`

Get the token for the bot.

#### Request

#### URL Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| ip | `string` | The IP address of the bot |
| event | `string` | The event name. It`s custom for each bot |

#### Response

    200 OK (and token in body)
    400 Bad Request (and error message in body)
    401 Unauthorized

#### Example

    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/bot/oath2/token?ip=10.0.1.2&event=EnableOTA

### GET `/api/bot/oath2/verify`

Verify the token for the bot. This method is used to verify the token in the bot client.

#### Request

#### URL Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| code | `string` | The token for the bot |
| event | `string` | The event name |

#### Response

    200 OK (and token in body)
    400 Bad Request (and error message in body)
    401 Unauthorized
    404 Not Found

#### Example

    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/bot/oath2/verify?code=Z7GhouOfR3iSoIC&event=EnableOTA