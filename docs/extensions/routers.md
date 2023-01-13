# Extensions: Routers

* [Structure](/structure.md)
* [Using resources and APIs](/using-resources-and-apis.md)
* [Routers](/routers.md)
* [How is it loaded?](/README.md#how-is-it-loaded)

## Routers

To add a router to your extension, you need to create a file in the ```routes``` folder with the extension ```.ts``` and add the following code to it:

```ts
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Test API');
});

module.exports = router;
```

And if you need change name of router, you need to add value to property ```ROUTER``` after export router:

```ts
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Test API');
});

module.exports = router;
module.exports.ROUTER = 'my-router';
```
