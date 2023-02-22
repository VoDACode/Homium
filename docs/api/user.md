# API: Users

# Navigation

* [Description](#description)
* [API](#api)
  * [Get all users](#get-all-users)
  * [Get user](#get-user)
  * [Get user permissions](#get-user-permissions)
  * [Create user](#create-user)
  * [Update user](#update-user)
  * [Delete user](#delete-user)
  * [Get user permission templates](#get-user-permission-templates)


# Description

If you want to get information about yourself, you can use the keyword `self` as the username.

# API

## Get all users

### Request

`GET /api/users/list`

### Response

    {
        "users": [
            {
                "lastname": "",
                "firstname": "",
                "username": "",
            }
        ]
    }

## Get user

### Request

`GET /api/users/list/:username`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| username | `string` | The username of the user |

### Response

    {
        "lastname": "",
        "firstname": "",
        "username": "",
    }

## Get user permissions

### Request

`GET /api/users/list/:username/permissions`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| username | `string` | The username of the user |

### Response

```
{
    "user":{
        "create": boolean,
        "remove": boolean,
        "update": boolean,
        "read": boolean
    },
    "script":{
        "create": boolean,
        "remove": boolean,
        "read": boolean
        "execute": boolean
    },
    "object":{
        "create": boolean,
        "remove": boolean,
        "update": boolean,
        "read": boolean,
        "canUse": boolean
    },
    "scense":{
        "create": boolean,
        "remove": boolean,
        "update": boolean
    },
    "devices":{
        "create": boolean,
        "remove": boolean,
        "update": boolean,
        "read": boolean,
        "canUse": boolean
    },
    "extensions":{
        "download": boolean,
        "remove": boolean,
        "read": boolean,
        "canConfigure": boolean,
        "canUse": boolean
    }
}
```

## Create user

### Request

`POST /api/users/list`

#### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| username | `string` | yes | The username of the user |
| password | `string` | yes | The password of the user |
| firstname | `string` | no | The firstname of the user |
| lastname | `string` | no | The lastname of the user |
| email | `string` | no | The email of the user |
| enabled | `boolean` | no | If the user is enabled |
| permissions | [`ClientPermissions`](/src/models/ClientPermissions.ts) | no | The permissions of the user |
| permissionTemplate | [`PermissionTemplate`](/src/models/ClientPermissions.ts) | no | The permission template of the user |

### Response

    201 Created

## Update user

### Request

`PUT /api/users/list`

#### URL Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| username | `string` | yes | The username of the user |

#### Body Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| password | `string` | no | The password of the user |
| firstname | `string` | no | The firstname of the user |
| lastname | `string` | no | The lastname of the user |
| email | `string` | no | The email of the user |
| enabled | `boolean` | no | If the user is enabled |
| permissions | [`ClientPermissions`](/src/models/ClientPermissions.ts) | no | The permissions of the user |
| permissionTemplate | [`PermissionTemplate`](/src/models/ClientPermissions.ts) | no | The permission template of the user |

### Response

    200 OK

## Delete user

### Request

`DELETE /api/users/list/:username`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| username | `string` | The username of the user |

### Response

    200 OK

## Get user permission templates

### Request

`GET /api/users/templates`

### Response

```
{
    "name": {
        "user":{
            "create": boolean,
            "remove": boolean,
            "update": boolean,
            "read": boolean
        },
        "script":{
            "create": boolean,
            "remove": boolean,
            "read": boolean
            "execute": boolean
        },
        "object":{
            "create": boolean,
            "remove": boolean,
            "update": boolean,
            "read": boolean,
            "canUse": boolean
        },
        "scense":{
            "create": boolean,
            "remove": boolean,
            "update": boolean
        },
        "devices":{
            "create": boolean,
            "remove": boolean,
            "update": boolean,
            "read": boolean,
            "canUse": boolean
        },
        "extensions":{
            "download": boolean,
            "remove": boolean,
            "read": boolean,
            "canConfigure": boolean,
            "canUse": boolean
        }
    }
}
```
