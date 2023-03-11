# API: Scripts

Scripts are a way to automate tasks in the house. They a written in the JavaScript language and can be used to automate anything from turning on the lights when you come home to sending a notification when the washing machine is done.

# Navigation

* [Create a script](#create-a-script)
* [Get a scripts](#get-a-scripts)
* [Get a script](#get-a-script)
* [Update a script](#update-a-script)
* [Update code of a script](#update-code-of-a-script)
* [Delete a script](#delete-a-script)
* [Run a script](#run-a-script)

## APIs

### Create a script

#### Request

`POST /api/scripts`

#### Body

```json
{
  "name": "string",
  "code": "string",
  "targetEvent": "string",
  "targetType": "string",
  "targetId": "string" | null,
  "description": "string" | null,
  "allowAnonymous": true | false | null,
  "enabled": true | false | null,
}
```

#### Description

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | `string` | The name of the script |
| code | `string` | The JavaScript code of the script |
| targetEvent | [`ScriptTargetEvent`](/src/models/ScriptModel.ts) | The event that triggers the script |
| targetType | [`ScriptTargetType`](/src/models/ScriptModel.ts) | The entity that runs the script |
| targetId | `string` or `null` | The id of the target |
| description | `string` or `null` | The description of the script |
| allowAnonymous | `boolean` or `null` | Whether the script can be run by anonymous users |
| enabled | `boolean` or `null` | Whether the script is enabled |

#### Response

```json
{
  "id": "string",
}
```

#### Description

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | `string` | The id of the script |

### Get a scripts

#### Request

`GET /api/scripts/`

#### Response

```json
[
    {
        "id": "string",
    },
    ...
]
```

#### Description

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | `string` | The id of the script |

### Get a script

#### Request

`GET /api/scripts/:id`

#### Response

```json
{
  "id": "string",
  "name": "string",
  "code": "string",
  "targetEvent": "string",
  "targetType": "string",
  "targetId": "string" | null,
  "description": "string" | null,
  "allowAnonymous": true | false,
}
```

#### Description

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | `string` | The id of the script |
| name | `string` | The name of the script |
| code | `string` | The JavaScript code of the script |
| targetEvent | [`ScriptTargetEvent`](/src/models/ScriptModel.ts) | The event that triggers the script |
| targetType | [`ScriptTargetType`](/src/models/ScriptModel.ts) | The entity that runs the script |
| targetId | `string` or `null` | The id of the target |
| description | `string` or `null` | The description of the script |
| allowAnonymous | `boolean` | Whether the script can be run by anonymous users |

### Update a script

#### Request

`PUT /api/scripts/:id`

#### Body

```json
{
  "name": "string" | null,
  "code": "string" | null,
  "targetEvent": "string" | null,
  "description": "string" | null,
  "allowAnonymous": true | false | null,
  "enabled": true | false | null,
}
```

#### Description

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | `string` or `null` | The name of the script |
| code | `string` or `null` | The JavaScript code of the script |
| targetEvent | [`ScriptTargetEvent`](/src/models/ScriptModel.ts) or `null` | The event that triggers the script |
| description | `string` or `null` | The description of the script |
| allowAnonymous | `boolean` or `null` | Whether the script can be run by anonymous users |
| enabled | `boolean` | Whether the script is enabled |

#### Response

```bash
    400 Bad Request
    404 Not Found
    200 OK
```

### Update code of a script

#### Request

`PUT /api/scripts/:id/code`

#### Body

```bash
    [code]
```

#### Description

| Name | Type | Description |
| ---- | ---- | ----------- |
| [code] | `string` | The JavaScript code of the script |

#### Response

```bash
    400 Bad Request
    404 Not Found
    200 OK
```

### Delete a script

#### Request

`DELETE /api/scripts/:id`

#### Response

```bash
    404 Not Found
    200 OK
```

### Run a script

#### Request

`GET /api/scripts/:id/execute`

#### Response

```bash
    404 Not Found
    401 Unauthorized
    400 Bad Request
    200 OK
```
