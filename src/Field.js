const _ = require('lodash');
const Types = require('./support/types.json');
const values = _.values(Types);

/**
 * A field object inside a schema.
 * Internally used only!
 */
class Field
{
    constructor(name, type, schema)
    {
        if (! values.includes(type)) {
            throw new TypeError('field type is not valid: '+type);
        }

        /**
         * The field name. (Can not be mutated)
         * @type {string}
         */
        Object.defineProperty(this,'name', {
            value: name
        });

        /**
         * The parent schema.
         * @type {Schema}
         */
        Object.defineProperty(this,'schema', {
            value: schema
        });

        /**
         * The type of field.
         * @type {string}
         */
        this.type = type;
        /**
         * The label for this field.
         * @type {string}
         */

        this.label = name;

        /**
         * The priority order for this field in the collection.
         * @type {number}
         */
        this.priority = 0;
        /**
         * Is this field required?
         * @type {boolean}
         */
        this.required = false;

        /**
         * If this field unique?
         * @type {boolean}
         */
        this.unique = false;

        /**
         * The reference model name, if describing a relationship.
         * @type {null|string}
         */
        this.reference = null;

        /**
         * The foreign key to use when looking up the relationship.
         * Only used when the reference property is set.
         * @type {string}
         */
        this.foreignKey = "_id";

        /**
         * The default value for the field.
         * @type {null}
         */
        this.value = null;
    }

    /**
     * Return the parent schema factory.
     * @returns {Factory}
     */
    get factory()
    {
        return this.schema.factory;
    }

    /**
     * Configure this field object.
     * @param opts {object|array|number|string|function}
     * @returns {Field}
     */
    configure(opts={})
    {
        if (Array.isArray(opts)) {
            // Passing an array of options.
            opts.forEach(opt => this.configure(opt) );
        } else if (typeof opts === 'string' && typeof this[opts] === 'boolean') {
            // If passing a string and it relates to a boolean value in the field, change to true.
            this[opts] = true;
        } else if (typeof opts === 'number') {
            // If giving a number, assume it's setting the field priority.
            this.priority = opts;
        } else if (typeof opts === 'function') {
            // If giving a function, call it.
            opts.call(this, this, this.schema);
        } else if (! opts) {
            // Nothing was given.
            return this;
        } else {
            // Assign properties to this object.
            _.assign(this,opts);
        }

        return this;
    }
}

module.exports = Field;