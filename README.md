angular-db
==========

Simple IndexedDB access for AngularJS. Works great with [IndexedDBShim](https://github.com/axemclion/IndexedDBShim)!

This is basically an incomplete wrapper around [db.js](https://github.com/aaronpowell/db.js/). Which is listed as a dependency in bower and must be included in the page.

### Example Usage:

**1. Install and include the library:**

```shell
bower install angular-db
```

```html
<script src="bower_components/db.js/src/db.js"></script>
<script src="bower_components/angular-db/db.js"></script>
```

**2. Set up the DB:**

```js
angular.module('mymodule', ['db'])

.config(function($dbProvider) {
  $dbProvider.connection('myapp', 2, {
    config: { key: { keyPath: 'key' } },
    stuff:  { key: { keyPath: 'Obj.ID' } },
  });
})
```

**3. Use the DB:**

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
