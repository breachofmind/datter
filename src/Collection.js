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

        /**
         * The parent model's factory class.
         * @type {null|Factory}
         */
        this._factory = null;

        this.add(items);
    }

    /**
     * Return the protected model class.
     * @returns {null|Factory}
     */
    get factory()
    {
        return this._factory;
    }

    /**
     * Return the model class.
     * @returns {Model|undefined}
     */
    get model()
    {
        if (! this._factory) {
            return undefined;
        }
        return this._factory.model;
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
     * Add a new item to the collection.
     * @param item {Model|Array}
     * @returns {Collection}
     */
    add(item)
    {
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