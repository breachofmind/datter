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
         * @type {null|ModelFactory}
         */
        this._model = null;

        this.add(items);
    }

    /**
     * Return the protected model class.
     * @returns {null|ModelFactory}
     */
    get model()
    {
        return this._model;
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

        if (! this.model) {
            // Adding the first item sets the collection type.
            this.model = item.$factory;
        } else if (item.$factory !== this.model) {
            // All models in a collection need to be of the same type.
            throw new TypeError('Item is not an instance of ' + this.model.name);
        } else if (this.includes(item)) {
            // We're not adding more than one instance of the item.
            return this;
        }

        this.push(item);

        return this;
    }
}

module.exports = Collection;