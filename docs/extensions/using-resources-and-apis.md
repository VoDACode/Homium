# Extensions: Using resources and APIs

* [Structure](\structure.md)
* [Using resources and APIs](\using-resources-and-apis.md)
* [Routers](\routers.md)
* [How is it loaded?](\README.md#how-is-it-loaded)

## Using resources

If you want to use resources in your extension, you need create request to ```/static/your-resource-name``` or ```/extensions/my-extension/static/your-resource-name``` and you will get your extension resource.

Example:

```html
<img src="/static/my-icons/my-image.png" alt="My image">
```

## Using APIs

If you want to use APIs in your extension, you need create request to ```/api/your-api-name``` or ```/extensions/my-extension/api/your-api-name``` and you will get your extension API.

Example:

```js
fetch("/api/my-api")
    .then(response => response.json())
    .then(data => console.log(data));
```

## Details

When you make a request to ```/api/your-api-name``` or ```/static/your-resource-name```, the script will try to find your extension and if it is found, the script will redirect the client to ```/extensions/my-extension/api/your-api-name``` or to ```/extensions/my-extension/static/your-resource-name``` respectively and you will get your extension API or resource.
