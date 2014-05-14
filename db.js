angular.module('formyula.db', [])

.provider('$db', function() {
  var module = this;
  var dbVersion = 1;
  var dbSchema = {};
  var dbName = 'myIndexedDB';

  var server;

  module.connection = function(name, version, schema, callback) {
    dbName = name;
    dbVersion = version;
    dbSchema = schema;
  }

  this.$get = ['$q', '$rootScope', '$timeout', function($q, $rootScope, $timeout) {

    function ObjectStore(storeName) {
      this.storeName = storeName;
    }

    ObjectStore.prototype = {
      internalObjectStore: function() {
        var d = $q.defer();
        if (server) {
          d.resolve(server);
        } else {
          var prom = db.open({
            server: dbName,
            version: dbVersion,
            schema: dbSchema
          });
          prom.done(function(s) {
            server = s;
            console.log('successfully opened db');
            d.resolve(s);
          });
          prom.fail(function(e) {
            console.log('failed to open database');
            d.reject(e);
          });
        }
        return d.promise;
      },

      insert: function(value) {
        var d = $q.defer();
        var storeName = this.storeName;

        this.internalObjectStore().then(function(server) {
          var store = server[storeName];
          var prom = store.add(value);

          prom.done(function(data) {
            $rootScope.$apply(function() {
              d.resolve(data);
            });
          });

          prom.fail(function(err) {
            console.log('failed to insert:', err);
            $rootScope.$apply(function() {
              d.reject(err);
            });
          });
        }, function(e) {
          $rootScope.$apply(function() {
            d.reject(e);
          });
        });

        return d.promise;
      },

      upsert: function(value) {
        var d = $q.defer();
        var storeName = this.storeName;

        this.internalObjectStore().then(function(server) {
          var store = server[storeName];
          var prom = store.update(value);

          prom.done(function(data) {
            $rootScope.$apply(function() {
              d.resolve(data);
            });
          });

          prom.fail(function(err) {
            console.log('failed to upsert:', err);
            $rootScope.$apply(function() {
              d.reject(err);
            });
          });
        }, function(e) {
          $rootScope.$apply(function() {
            d.reject(e);
          });
        });

        return d.promise;
      },

      remove: function(key) {
        var d = $q.defer();
        var storeName = this.storeName;

        this.internalObjectStore().then(function(server) {
          var prom = server.remove(key);
          prom.done(function(key) {
            $rootScope.$apply(function() {
              d.resolve(key);
            });
          });
          prom.fail(function(err) {
            console.log('failed to remove:', err);
            $rootScope.$apply(function() {
              d.reject(err);
            });
          })
        }, function(e) {
          $rootScope.$apply(function() {
            d.reject(e);
          });
        });

        return d.promise;
      },

      find: function(key) {
        var d = $q.defer();
        var storeName = this.storeName;

        this.internalObjectStore().then(function(server) {
          var store = server[storeName];
          var prom = store.get(key);

          prom.done(function(data) {
            $rootScope.$apply(function() {
              d.resolve(data);
            });
          });

          prom.fail(function(err) {
            console.log('failed to find:', err);
            $rootScope.$apply(function() {
              d.reject(err);
            });
          });
        }, function(e) {
          $rootScope.$apply(function() {
            d.reject(e);
          });
        });

        return d.promise;
      },

      findMany: function(keys) {
        var d = $q.defer();
        var storeName = this.storeName;

        if (keys.length === 0) {
          console.log('asked for zero keys');
          $timeout(function() {
            $rootScope.$apply(function() {
              d.resolve([]);
            });
          }, 1);
          return d.promise;
        }

        this.internalObjectStore().then(function(server) {
          var store = server[storeName];
          var slots = [];
          var num = 0;

          var _resolve = function() {
            if (num == keys.length) {
              $rootScope.$apply(function() {
                var isFail = false;
                angular.forEach(slots, function(slot) {
                  if (slot === null) {
                    d.reject(slots);
                  } else {
                    d.resolve(slots);
                  }
                });
              });
            }
          }
          
          angular.forEach(keys, function(key, idx) {
            var i = idx;
            var prom = store.get(key);
            
            prom.done(function(data) {
              num++;
              slots[i] = data;
              _resolve();
            });

            prom.fail(function(err) {
              console.log('failed to find:', err);
              num++;
              slots[i] = null;
              _resolve();
            });
          });
        }, function(e) {
          $rootScope.$apply(function() {
            d.reject(e);
          });
        });
        
        return d.promise;
      },

      getAll: function() {
        var d = $q.defer();
        var storeName = this.storeName;

        this.internalObjectStore().then(function(server) {
          var store = server[storeName];
          var prom = store.query().filter().execute();

          prom.done(function(data) {
            $rootScope.$apply(function() {
              d.resolve(data);
            });
          });

          prom.fail(function(err) {
            console.log('failed to getAll:', err);
            $rootScope.$apply(function() {
              d.reject(err);
            });
          });
        }, function(e) {
          $rootScope.$apply(function() {
            d.reject(e);
          });
        });

        return d.promise;
      }
    }

    return {
      objectStore: function(name) {
        return new ObjectStore(name);
      }
    };
  }];
})
