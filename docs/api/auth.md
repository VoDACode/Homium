# API: Authentication

## Navigation

* [APIs](#apis)
    * [__signin__](#signin)
    * [__signout__](#signout)
    * [__refresh__](#refresh)
* [Using auth guard in API method](#using-auth-guard-in-api-method)

# APIs

## __signin__

Sign in to the API. Writes access token to the cookie client.

### Request

    POST /api/auth/signin

### Parameters

   Name    |   Type   |         Description
-----------|----------|--------------------------------
`username` | `string` | The email address of the user.
`password` | `string` | The password of the user.

### Response

    200 OK
    401 Unauthorized

### Example

    curl -i 
    -X POST
    -H "Content-Type: application/json"
    -d '{"username": "VoDA", "password": "password"}'
    http://localhost:3000/api/auth/signin

## __signout__

Sign out of the API.

### Request

    POST /api/auth/signout

### Response

    200 OK
    401 Unauthorized

### Example

    curl -i 
    -X POST
    -H "Content-Type: application/json"
    http://localhost:3000/api/auth/signout

## __refresh__

Refresh the access token.

### Request

    POST /api/auth/refresh

### Response

    200 OK
    401 Unauthorized

### Example

    curl -i 
    -X POST
    -H "Content-Type: application/json"
    http://localhost:3000/api/auth/refresh

# Using auth guard in API method

When you create a private API, you should use the `authGuard` to protect it.

```ts
import express from 'express';
import { authGuard } from '../guards/AuthGuard';
const router = express.Router();

router.get('/your/api/path', authGuard, (req, res) => {
    // your API logic
});

module.exports = router;
```
