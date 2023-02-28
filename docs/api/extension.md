# API: Extension

# Navigation

- [Navigation](#navigation)
- [APIs](#apis)
  - [`GET /api/extensions`](#get-apiextensions)
    - [Response](#response)
- [`GET /api/extensions/:id`](#get-apiextensionsid)
    - [Response](#response-1)
  - [`GET /api/extensions/:id/events`](#get-apiextensionsidevents)
    - [Response](#response-2)


## APIs

### `GET /api/extensions`

Get all extensions.

### Response

```json
[
    {
        "id": "e4eaaaf3-3c3b-11e8-b467-0ed5f89f718b",
        "name": "Example Extension",
        "description": "This is an example extension.",
        "version": "1.0.0",
        "author": "Example Author",
        "url": "https://example.com",
        "authorUrl": "https://example.com",
        "urls":{
            "static": "localhost:3000/extensions/e4eaaaf3-3c3b-11e8-b467-0ed5f89f718b/static/",
            "api": "localhost:3000/extensions/e4eaaaf3-3c3b-11e8-b467-0ed5f89f718b/api/",
        }
    }
]
```

### `GET /api/extensions/:id`

Get an extension.

### Response

```json
{
    "id": "e4eaaaf3-3c3b-11e8-b467-0ed5f89f718b",
    "name": "Example Extension",
    "description": "This is an example extension.",
    "version": "1.0.0",
    "author": "Example Author",
    "url": "https://example.com",
    "authorUrl": "https://example.com",
    "urls":{
        "static": "localhost:3000/extensions/e4eaaaf3-3c3b-11e8-b467-0ed5f89f718b/static/",
        "api": "localhost:3000/extensions/e4eaaaf3-3c3b-11e8-b467-0ed5f89f718b/api/",
    }
}
```

### `GET /api/extensions/:id/events`

Get all events of an extension.

### Response

```json
[
    {
        "name": "some-event",
        "description": "This is an example event.",
    }
]
```