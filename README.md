# angularjs-collection

An Angular JS service to manage collection of object with a primary key constraint.

## Overview

```coffee
angular.module('my_app').service 'dataStore',
  (
    'Collection'
  ) ->

    collection: new Collection({primary_key: 'id'})
```


```coffee
angular.module('my_app').controller 'DataController',
  (
    'dataStore'
  ) ->

    # filter by primary key
    selected_ids = [12, 1, 44]
    selected_objects = dataStore.collection.where(selected_ids)

    # filter by attribute
    engineers = dataStore.collection.where(title: 'engineer')

    # delete by primary key
    dataStore.collection.remove([2,5,6])

    # delete by attribute
    dataStore.collection.remove(title: 'engineer')

    # Retrieve a copy of the collection
    model_copy = dataStore.collection.models

    model_copy == dataStore.collection.models           # false
    _.isEqual(model_copy, dataStore.collection.models)  # true

    # Add will overwrite any existing record matching the added
    # object primary key
    dataStore.collection.add [
      {id: 123, title: 'engineer'}
      {id: 124, title: 'architect'}
    ]
```

## Proxy methods

Those methods are simple proxy to lodash and aren't documented here. You may find their documentation on the
lodash website: https://lodash.com/docs

Those proxy method receive the collection's content as argument.

```coffee
dataStore.collection.pluck('first_name')
# >>> 'john', 'steve', 'anna'


_.pluck(dataStore.collection.models, 'first_name')
# >>> 'john', 'steve', 'anna'
# same but a bit less efficient because .models returns a clone of the collection
```

Proxy methods are:

* `filter(fn)` [lodash doc](https://lodash.com/docs#filter)
* `reject(fn)` [lodash doc](https://lodash.com/docs#reject)
* `groupBy(arg)` [lodash doc](https://lodash.com/docs#groupBy)
* `last()` [lodash doc](https://lodash.com/docs#last)
* `first()` [lodash doc](https://lodash.com/docs#first)
* `pluck(arg)` [lodash doc](https://lodash.com/docs#pluck)
