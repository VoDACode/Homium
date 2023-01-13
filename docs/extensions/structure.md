# Extensions: Structure

* [Structure](\structure.md)
* [Using resources and APIs](\using-resources-and-apis.md)
* [Routers](\routers.md)
* [How is it loaded?](\README.md#how-is-it-loaded)

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
    public description: string = "MyExtension extension";
    public version: string = "1.0.0";

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
