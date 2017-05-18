const Model = require('./Model');


class Collection extends Array
{
    /**
     * Constructor.
     * @param items {Model|Array}
     */
    constructor(items=[])
    {
        super();

        this.add(items);
    }

    /**
     * Return the protected factory instance.
     * The first item in the array is used to return the factory instance.
     * @returns {null|Factory}
     */
    get factory()
    {
        return this.isEmpty ? null : this[0].$factory;
    }

    /**
     * Return the model class.
     * @returns {null|Model}
     */
    get model()
    {
        return this.isEmpty ? null : this.factory.model;
    }

    /**
     * Check if this collection is empty.
     * @returns {boolean}
     */
    get isEmpty()
    {
        return this.length === 0;
    }

    /**
     * Filter this collection given the parameters and return a new collection.
     * @param where
     * @returns {Collection}
     */
    filter(where={})
    {
        return new Collection( _.filter(this,where) );
    }

    /**
     * Add a new item to the collection.
     * @param item {Model|Array}
     * @returns {Collection}
     */
    add(item)
    {
        if (! item) {
            return this;
        }
        // Adding an array items.
        if (Array.isArray(item)) {
            item.forEach(this.add.bind(this));
            return this;
        }
        if (! (item instanceof Model)) {
            throw new TypeError("Item is not an instance of model");
        }

        if (! this._factory) {
            // Adding the first item sets the collection type.
            this._factory = item.$factory;

        } else if (item.$factory !== this._factory) {
            // All models in a collection need to be of the same type.
            throw new TypeError('Item is not an instance of ' + this._factory.name);

        } else if (this.includes(item)) {
            // We're not adding more than one instance of the item.
            return this;
        }

        this.push(item);

        return this;
    }
}

module.exports = Collection;