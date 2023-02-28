# Extensions: Structure

* [Structure](structure.md)
* [Using resources and APIs](using-resources-and-apis.md)
* [Routers](routers.md)
* [How is it loaded?](README.md#how-is-it-loaded)

## File structure of the extension:

```bash
extensions
└── my-extension
    ├── package.json
    ├── index.ts
    ├── routes
    │   └── router-name.ts
    │   + other routers
    └── static
        └── index.html
        + other static files
```

## Requirements for "index.ts"

index.ts must implement the abstraction: IExtension

Example:

```ts
import { IExtension } from "../types";

module.exports = class MyExtension implements IExtension {
    public name: string = "MyExtension";
    public globalName: string = "my-extension";

    constructor() {
        console.log("MyExtension extension loaded");
    }
    
    public stop(): void {
        console.log("MyExtension extension stopped");
    }

    public run(): void {
        console.log("MyExtension extension running");
    }
}
```

## Requirements for "package.json"

package.json must contain the following fields:

Name | Type | Required | Description
--- | --- | --- | ---
name | `string` | yes | Name of the extension
version | `string` | yes | Version of the extension
description | `string` | no | Description of the extension 
author | `string` | no | Author of the extension
disabled | `boolean` | no | If true, the extension will not be loaded
dependencies | `object` | no | Dependencies of the extension

Example:

```json
{
    "name": "my-extension",
    "version": "1.0.0",
    "description": "My extension",
    "author": "My name",
    "disabled": false,
    "dependencies": {}
}
```