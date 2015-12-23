var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module('collection', []).factory('Collection', function() {
  var Collection;
  return Collection = (function() {
    function Collection(rows, config) {
      if (rows == null) {
        rows = [];
      }
      if (config == null) {
        config = {};
      }
      this.__primary_key__ = config.primary_key || 'id';
      this.__content__ = rows;
    }


    /**
    Empty the collection if no argument provided, otherwise
    sets the collection to the past attribute.
     */

    Collection.prototype.reset = function(rows) {
      if (rows == null) {
        rows = [];
      }
      return this.__content__ = _.clone(rows);
    };


    /**
    returns the number of item contained in the collection
    ... like length does
     */

    Collection.prototype.size = function() {
      return this.__content__.length;
    };


    /**
    Adds a set of object to the collection
    If the object already exist, it will be replaced in the
    collection and will keep the same position, otherwise
    the object is appended to the end of the collection
     */

    Collection.prototype.add = function(rows) {
      var i, indexed_content, inserted, len, ref, remaining, row;
      if (!_.isArray(rows)) {
        rows = [rows];
      }
      if (this.__content__.length) {
        indexed_content = _.indexBy(this.__content__, this.__primary_key__);
        ref = _.partition(rows, (function(_this) {
          return function(row) {
            var pk_value, position;
            pk_value = row[_this.__primary_key__];
            if (pk_value in indexed_content) {
              position = _this.__content__.indexOf(indexed_content[pk_value]);
              _this.__content__[position] = row;
              return true;
            }
          };
        })(this)), inserted = ref[0], remaining = ref[1];
        for (i = 0, len = remaining.length; i < len; i++) {
          row = remaining[i];
          this.__content__.push(row);
        }
      } else {
        this.__content__ = _.clone(rows);
      }
      return this;
    };


    /**
    Returns an array of matching object.
    
    predicate can be a JSON object:
        collection.where({name: 'foo', type:'bar'})
    
    or an array of primary keys
        collection.where([1, 3, 6])
     */

    Collection.prototype.where = function(predicate) {
      if (!predicate) {
        return [];
      }
      if (_.isArray(predicate)) {
        return _.filter(this.__content__, (function(_this) {
          return function(row) {
            var ref;
            return ref = row[_this.__primary_key__], indexOf.call(predicate, ref) >= 0;
          };
        })(this));
      }
      return _.where(this.__content__, predicate);
    };


    /**
    Returns the first matching object or `null` from the collection.
    
    Accepts a primary key value (int, string)
    
        collection.find('my_object_id');
    
    or a JSON object:
    
        collection.find({name: 'foo', type:'bar'});
     */

    Collection.prototype.get = function(predicate) {
      if (_.isString(predicate) || _.isNumber(predicate)) {
        return _.find(this.__content__, this.__primary_key__, predicate);
      }
      return _.find(this.__content__, predicate);
    };


    /**
    Accepts a primary key value (int, string),
    
        collection.remove('my_object_id');
    
    an arrays or primary key value
    
        collection.remove(['id_1', 'id_3']);
    
    or a JSON object:
    
        collection.remove({first_name: 'Anna'});
    
    to be removed from the collection.
    
    Returns the removed objects.
     */

    Collection.prototype.remove = function(predicate) {
      if (predicate == null) {
        return this;
      }
      if (_.isString(predicate) || _.isNumber(predicate)) {
        predicate = [predicate];
      }
      if (_.isArray(predicate)) {
        return _.remove(this.__content__, (function(_this) {
          return function(row) {
            var ref;
            return ref = row[_this.__primary_key__], indexOf.call(predicate, ref) >= 0;
          };
        })(this));
      }
      return _.remove(this.__content__, predicate);
    };


    /**
    proxy method to lodash filter applied to the collection
     */

    Collection.prototype.filter = function(fn) {
      return _.filter(this.__content__, fn);
    };


    /**
    proxy method to lodash reject applied to the collection
     */

    Collection.prototype.reject = function(fn) {
      return _.reject(this.__content__, fn);
    };


    /**
    proxy method to lodash groupBy applied to the collection
     */

    Collection.prototype.groupBy = function(predicate) {
      return _.groupBy(this.__content__, predicate);
    };


    /**
    proxy method to lodash last applied to the collection
     */

    Collection.prototype.last = function() {
      return _.last(this.__content__);
    };


    /**
    proxy method to lodash first applied to the collection
     */

    Collection.prototype.first = function() {
      return _.first(this.__content__);
    };


    /**
    proxy method to lodash pluck applied to the collection
     */

    Collection.prototype.pluck = function(property) {
      return _.pluck(this.__content__, property);
    };


    /**
    Returns a read only set of models
     */

    Object.defineProperties(Collection.prototype, {
      models: {
        get: function() {
          return _.clone(this.__content__);
        },
        set: function() {
          throw Error('collection.models is a readonly attribute');
        }
      }
    });

    return Collection;

  })();
});
