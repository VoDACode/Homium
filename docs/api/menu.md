# API: Menu

# Navigation

* [__extensions__](#extensions)
* [__devices__](#devices)

## __extensions__

Return all extensions menus

### Request

    GET /api/menu/extensions

### Response

    200 OK
    401 Unauthorized

If response is 200 OK, the body contains a list of [ExtensionModel](src/models/ExtensionModel.ts).

### Example

```bash
    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/menu/extensions
```

## __devices__

__No implementation__

Return all devices menus

### Request

    GET /api/menu/devices

### Response

    200 OK
    401 Unauthorized

### Example

```bash
    curl -i 
    -X GET
    -H "Content-Type: application/json"
    http://localhost:3000/api/menu/devices
```
