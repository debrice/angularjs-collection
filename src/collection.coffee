angular.module('collection', [])

.factory 'Collection', ->
  class Collection
    constructor: (rows=[], config={}) ->
      @__primary_key__ = config.primary_key or 'id'
      @__content__ = rows

    ###*
    Empty the collection if no argument provided, otherwise
    sets the collection to the past attribute.
    ###
    reset: (rows=[]) ->
      @__content__ = _.clone(rows)

    ###*
    returns the number of item contained in the collection
    ... like length does
    ###
    size: ->
      return @__content__.length

    ###*
    Adds a set of object to the collection
    If the object already exist, it will be replaced in the
    collection and will keep the same position, otherwise
    the object is appended to the end of the collection
    ###
    add: (rows) ->
      if not _.isArray(rows)
        rows = [rows]

      if @__content__.length
        indexed_content = _.indexBy @__content__, @__primary_key__

        # Replace existing object at their current place
        [inserted, remaining] = _.partition rows, (row) =>
          pk_value = row[@__primary_key__]

          # if pk is already present in the collection
          # we replace the existing record
          if pk_value of indexed_content
            position = @__content__.indexOf(indexed_content[pk_value])
            @__content__[position] = row
            # return true to mark it as inserted
            return true

        # then lets push the remaining ones
        for row in remaining
          @__content__.push(row)

      # if the collection was empty we directly
      # replace it by the added rows
      else
        @__content__ = _.clone(rows)

      return @

    ###*
    Returns an array of matching object.

    predicate can be a JSON object:
        collection.where({name: 'foo', type:'bar'})

    or an array of primary keys
        collection.where([1, 3, 6])

    ###
    where: (predicate) ->
      return [] unless predicate

      if _.isArray predicate
        return _.filter @__content__, (row) =>
          row[@__primary_key__] in predicate

      return _.where(@__content__, predicate)

    ###*
    Returns the first matching object or `null` from the collection.

    Accepts a primary key value (int, string)

        collection.find('my_object_id');

    or a JSON object:

        collection.find({name: 'foo', type:'bar'});
    ###
    get: (predicate) ->
      if _.isString(predicate) or _.isNumber(predicate)
        return _.find(@__content__, @__primary_key__, predicate)

      return _.find(@__content__, predicate)

    ###*
    Accepts a primary key value (int, string),

        collection.remove('my_object_id');

    an arrays or primary key value

        collection.remove(['id_1', 'id_3']);

    or a JSON object:

        collection.remove({first_name: 'Anna'});

    to be removed from the collection.

    Returns the removed objects.
    ###
    remove: (predicate) ->
      return @ unless predicate?

      # if we pass a single primary key (int or string)
      if _.isString(predicate) or _.isNumber(predicate)
        predicate = [predicate]

      # if we pass an array of primary key
      if _.isArray predicate
        return _.remove @__content__, (row) =>
          row[@__primary_key__] in predicate

      return _.remove(@__content__, predicate)

    ###*
    proxy method to lodash filter applied to the collection
    ###
    filter: (fn) ->
      return _.filter(@__content__, fn)

    ###*
    proxy method to lodash reject applied to the collection
    ###
    reject: (fn) ->
      return _.reject(@__content__, fn)

    ###*
    proxy method to lodash groupBy applied to the collection
    ###
    groupBy: (predicate) ->
      return _.groupBy(@__content__, predicate)

    ###*
    proxy method to lodash last applied to the collection
    ###
    last: ->
      return _.last(@__content__)

    ###*
    proxy method to lodash first applied to the collection
    ###
    first: ->
      return _.first(@__content__)

    ###*
    proxy method to lodash pluck applied to the collection
    ###
    pluck: (property) ->
      return _.pluck(@__content__, property)

    ###*
    Returns a read only set of models
    ###
    Object.defineProperties @prototype,
      models:
        get: ->
          return _.clone(@__content__)
        set: ->
          throw Error('collection.models is a readonly attribute')
