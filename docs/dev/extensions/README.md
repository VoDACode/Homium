# Extensions

* [Structure](structure.md)
* [Using resources and APIs](using-resources-and-apis.md)
* [Routers](routers.md)
* [How is it loaded?](README.md#how-is-it-loaded)


## How is it loaded?

### Step 1
>
> When you run the program, the script analyzes the "extensions" folder in the root and gets all the folders in it.
>
### Step 2
>
> The script then loops through each folder and tries to find the file "package.json" and "index.ts", if the file is > not found the script will skip that folder, otherwise the script will try to get the dependencies of "package.json" > and if these dependencies are not installed - script to install these dependencies.
>
### Step 3
>
>Then script will try to load the "index.ts" file and if it is loaded successfully, the script will add the extension to the list of loaded extensions and add routers from foulder "routes" and add static files from folder "static".
