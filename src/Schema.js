const _ = require('lodash');
const Field = require('./Field');
const Types = require('./support/types.json');

class Schema extends Map
{
    /**
     * Constructor.
     * @param factory {Factory}
     */
    constructor(factory)
    {
        super();

        /**
         * Return the protected factory instance.
         * @type {Factory}
         */
        Object.defineProperty(this, 'factory', {
            value: factory
        });
    }

    /**
     * Return an array of fields, sorted by priority.
     * @returns {Array<Field>}
     */
    get fields()
    {
        return this.each(field => {
            return field;
        }).sort(sortByPriority);
    }

    /**
     * Override of the Map.set() method, which checks the arguments.
     * @param name {string}
     * @param value {Field}
     */
    set(name,value)
    {
        if (! (value instanceof Field)) {
            throw new TypeError('second argument must be Field instance');
        } else if (typeof name !== 'string') {
            throw new TypeError('first argument must be a string');
        }
        super.set(name,value);
    }

    /**
     * Iterate through each field and call a function, which returns an output for each.
     * @param fn {Function}
     * @returns {Array}
     */
    each(fn)
    {
        let out = [];
        this.forEach(field => {
            out.push(fn.call(this,field));
        });
        return out;
    }

    /**
     * Return a filtered array, given the parameters.
     * @see https://lodash.com/docs/4.17.4#filter
     * @param where {object|function|string}
     * @returns {Array}
     */
    filter(where={})
    {
        return _.filter(this.fields, where);
    }

    /**
     * Create a new field object.
     * @param fieldName {string}
     * @param type {string}
     * @param opts {object|array|number|string|function}
     * @returns {Schema}
     */
    field(fieldName,type=Types.TEXT,opts={})
    {
        if (typeof fieldName !== 'string') {
            throw new TypeError('first argument must be a string');
        }
        // The field name should not contain spaces.
        fieldName = _.snakeCase(fieldName);

        let field = new Field(fieldName,type,this);

        // If not passing the priority, use the current size of the schema.
        field.priority = this.size;

        // Add to the map.
        this.set(fieldName, field.configure(opts));

        return this;
    }

    /**
     * Mass assign labels for fields.
     * @param map {object}
     * @returns {Schema}
     */
    labels(map={})
    {
        _.each(map, (value,fieldName) => {
            this.get(fieldName).label = value;
        });
        return this;
    }

    /**
     * Create default timestamp fields.
     * @returns {Schema}
     */
    timestamps()
    {
        this.field('created_at',Types.DATETIME);
        this.field('modified_at',Types.DATETIME);

        return this;
    }

    /**
     * Create an ID relationship where the ID references another model.
     * @param fieldName {string}
     * @param modelName {string}
     * @param opts {object|array|number|string|function}
     * @returns {Schema}
     */
    hasOne(fieldName, modelName, opts={})
    {
        return this.field(fieldName,Types.ID, [
            {reference:modelName},
            opts,
        ]);
    }

    /**
     * Create a relationship field where this model has many references to another model.
     * It will look for all instances where the primary key is in the foreign table.
     * @param fieldName {string}
     * @param modelName {string}
     * @param opts {object|array|number|string|function}
     * @returns {Schema}
     */
    hasMany(fieldName, modelName, opts={})
    {
        return this.field(fieldName,Types.ARRAY, [
            {reference:modelName},
            opts,
        ]);
    }

    /**
     * Convert this object to a JSON array.
     * @returns {Array.<Field>}
     */
    toJSON()
    {
        return this.fields;
    }
}


// Setup simple helper methods
// for Schema prototype.
[
    Types.TEXT,
    Types.NUMBER,
    Types.FLOAT,
    Types.BOOLEAN,
    Types.DATE,
    Types.DATETIME,
].forEach(methodName =>
{
    Schema.prototype[methodName] = function(fieldName,opts={}) {
        return this.field(fieldName, methodName, opts);
    }
});


/**
 * Sorting function.
 * @param a {Field}
 * @param b {Field}
 * @returns {number}
 */
function sortByPriority(a,b)
{
    return a.priority === b.priority ? 0 : (a.priority > b.priority ? 1 : -1) ;
}

module.exports = Schema;