angular-db
==========

Simple IndexedDB access for AngularJS. Works great with [IndexedDBShim](https://github.com/axemclion/IndexedDBShim)!


### Example Usage:

**1. Set up the DB:**

```js
angular.module('mymodule', ['db'])

.config(function($dbProvider) {
  $dbProvider.connection('myapp', 2, {
    config: { key: { keyPath: 'key' } },
    stuff:  { key: { keyPath: 'Obj.ID' } },
  });
})
```

**2. Use the DB:**

```js
angular.module('mymodule.submodule', ['db'])

.controller('MyController', function($db) {
  // fetch the object store
  var myObjectStore = $db.objectStore('config').then( ... );
  
  // put something... all methods return a promise
  myObjectStore.save({key: 'stuff', otherkey: 'bla bla bla'}).then( ... );
  
  // fetch one object
  myObjectStore.find('stuff');
  
  // fetch all objects
  myObjectStore.getAll().then( ... );
  
  // etc... just look at the file until I write more docs. It's super simple.
})

```
