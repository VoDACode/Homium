# API: Stream

## Description

This is controller for streams. It supports WS streaming.

## Navigation

* [APIs](#apis)
  * [__object-update/:id__](#object-updateid)
  * [__object-update/:id/:prop__](#object-updateidprop)

## APIs

### __object-update/:id__

Send the current object after its update to all clients.

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.

### Data format

```
{
    "key": "value",
    "key2": "value2",
    ...
}
```

### __object-update/:id/:prop__

Send the current object property after its update to all clients.

### Parameters in URL

Name   | Type | Description
--------|------|-------------
`id`    | `string` | The id of the object.
`prop`    | `string` | The name of the property.

### Data format

Returns the __current__ value of the property.
