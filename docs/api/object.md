# API: Object

# Navigation

* [APIs](#apis)
  * [__create__](#create)
  * [__get/:id__](#getid)
  * [__get-root__](#get-root)
  * [__get/:id/children__](#getidchildren)
  * [__get/:id/:prop/history__](#getidprophistory)
  * [__list__](#list)
  * [__list/ids__](#listids)
  * [__list/:id__](#listid)
  * [__update/:id__](#updateid)
  * [__update/:id/parent__](#updateidparent)
  * [__update/:id/children__](#updateidchildren)
  * [__update/:id/object__](#updateidobject)
  * [__set/:id__](#setid)
  * [__remove/:id__](#removeid)
* [Stream](stream.md)
  * [__object-update/:id__](stream.md#object-updateid)
  * [__object-update/:id/:prop__](stream.md#object-updateidprop)

# APIs

## __create__

Create a new object.

### Request

    POST /api/object/create

### Parameters in body

   Name   | Type | Description
----------|------|-------------
`name`    | `string` | The name of the object.
`object`    | [`ObjectProperty`](/src/models/ObjectProperty.ts)[] | The type of the object.
`description`    | `string` or `NULL` | The description of the object.
`parentId`    | `string` or `NULL` | The parent id of the object.
`allowAnonymous`   | `boolean` | Whether the object is accessible by anonymous users.

### Response

    200 OK (Object ID)
    400 Bad Request
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X POST
    -H "Content-Type: application/json"
    -d '{
        "name": "LED",
        "description": "This is LED",
        "object": [
            {
                "key": "status",
                "value": 0,
                "canHaveHistory": true,
                "historyLimit": 100,
                "mqttProperty":{
                    "display": true,
                    "subscribe": false
                }
            },
            {
                "key": "brightness", 
                "value": 10, 
                "canHaveHistory": true, 
                "historyLimit": 100,
                "mqttProperty":{
                    "display": true,
                    "subscribe": true
                }
            }
        ],
        "allowAnonymous": true
        }'
    http://localhost:3000/api/object/create
```

## __list__

List all objects.

### Request

    GET /api/object/list

### URL Parameters

Name   | Type | Description
--------|------|-------------
`viewProperties`    | `viewProperties` | The properties to be displayed.

### Response body

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.
`name`    | `string` | The name of the object.
`parentId`    | `string` or `NULL` | The parent id of the object.
`updatedAt`    | `string` | The last update date of the object.
`properties`    | [`ObjectProperty`](/src/models/ObjectProperty.ts)[] | The properties of the object.
`description`    | `string` or `NULL` | The description of the object.
`allowAnonymous`   | `boolean` | Whether the object is accessible by anonymous users.
`systemObject`   | `boolean` | Whether the object is a system object.

### Response

    200 OK (Object array)
    401 Unauthorized
    403 Forbidden

### Example

```bash
    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/object/list
```

## __list/ids__

List all objects ID`s.

### Request

    GET /api/object/list/ids

### Response

    200 OK (Object ID`s array)
    401 Unauthorized
    403 Forbidden

### Example

```bash
    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/object/list/ids
```

## __list/:id__

Return the object with the given id.

### Request

    GET /api/object/list/:id

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.

### URL Parameters

Name   | Type | Description
--------|------|-------------
`viewProperties`    | `viewProperties` | The properties to be displayed.

### Response body

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.
`name`    | `string` | The name of the object.
`parentId`    | `string` or `NULL` | The parent id of the object.
`updatedAt`    | `string` | The last update date of the object.
`children`     | `string[]` | The children of the object.
`properties`    | [`ObjectProperty`](/src/models/ObjectProperty.ts)[] | The properties of the object.
`description`    | `string` or `NULL` | The description of the object.
`allowAnonymous`   | `boolean` | Whether the object is accessible by anonymous users.
`systemObject`   | `boolean` | Whether the object is a system object.

### Response

    200 OK (Object)
    400 Bad Request
    401 Unauthorized
    403 Forbidden
    404 Not Found

### Example

```bash
    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/object/list/5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c
```

## __get/:id__

Get an object.

### Request

    GET /api/object/get/:id

### Parameters in URL

Name   | Type | Description
----------|------|-------------
`id`    | `string` | The id of the object.

### Response

    200 OK
    400 Bad Request
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/object/get/5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c
```

## __get-root__

Get the root objects ID`s.

### Request

    GET /api/object/get-root

### Response

    200 OK
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/object/get-root
```

## __get/:id/children__

Get the children of an object.

### Request

    GET /api/object/get/:id/children

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.

### Response

    200 OK (Objects ID`s array)
    400 Bad Request
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/object/get/5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c/children
```

## __get/:id/:prop/history__

Get the history of an object property.

### Request

    GET /api/object/get/:id/:prop/history

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.
`prop`    | `string` | The name of the property.

### Response

    200 OK
    {
        current: value,
        history: [
            {
                value: value,
                date: date
            },
            ...
        ]
    }
    
    400 Bad Request
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/object/get/5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c/status/history
```

## __update/:id__

Update an object.

### Request

    PUT /api/object/update/:id

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.

### Parameters in body

Name   | Type | Description
--------|------|-------------
`name`    | `string` or `NULL` | The name of the object.
`description`    | `string` or `NULL` | The description of the object.
`allowAnonymous`   | `boolean` or `NULL` | Whether the object is accessible by anonymous users.

### Response

    200 OK
    400 Bad Request
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X PUT
    -H "Content-Type: application/json"
    -d '{
            "name": "LED",
            "description": "This is LED",
            "allowAnonymous": true
        }'
    http://localhost:3000/api/object/update/5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c
```

## __update/:id/parent__

Update the parent of an object.

### Request

    PUT /api/object/update/:id/parent

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.

### Parameters in body

Name   | Type | Description
--------|------|-------------
`parentId`    | `string` | The parent id of the object.

### Response

    200 OK
    400 Bad Request
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X PUT
    -H "Content-Type: application/json"
    -d '{
            "parentId": "5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c"
        }'
    http://localhost:3000/api/object/update/5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c/parent
```

## __update/:id/children__

Update the children of an object.

### Request

    PUT /api/object/update/:id/children

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.

### Parameters in body

Name   | Type | Description
--------|------|-------------
`children`    | `string[]` | The children id of the object.

### Response

    200 OK
    400 Bad Request
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X PUT
    -H "Content-Type: application/json"
    -d '{
            "children": ["378056781-1b5a-4b1f-9c1c-1b5a4b1f9c1c"]
        }'
    http://localhost:3000/api/object/update/5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c/children
```

## __update/:id/object__

Update the object of an object.

### Request

    PUT /api/object/update/:id/object

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.

### Parameters in body

Type | Description
------|-------------
[ObjectProperty](/src/models/ObjectProperty.ts)[] | The object of the object.

### Response

    200 OK
    400 Bad Request
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X PUT
    -H "Content-Type: application/json"
    -d '[
            {
                "key": "status",
                "value": true,
                "canHaveHistory": true,
                "historyLimit": 100
            }
        ]'
    http://localhost:3000/api/object/update/5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c/object
```

## __set/:id__

Set the value of an object property.

### Request

    GET /api/object/set/:id?key=:key&value=:value

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.
`key`    | `string` | The name of the property.
`value`    | `string` | The value of the property.

### Response

    200 OK
    400 Bad Request
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/object/set/5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c?key=status&value=true
```

## __remove/:id__

Remove an object.

### Request

    DELETE /api/object/remove/:id

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.

### Response

    200 OK
    400 Bad Request
    401 Unauthorized
    404 Not Found

### Example

```bash
    curl -i 
    -X DELETE
    -H "Content-Type: application/json"
    http://localhost:3000/api/object/remove/5f9f1b9b-1b5a-4b1f-9c1c-1b5a4b1f9c1c
```