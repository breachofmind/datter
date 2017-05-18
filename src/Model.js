const _ = require('lodash');

/**
 * The base model class.
 * @author Mike Adamczyk <mike@bom.us>
 */
class Model
{
    /**
     * Constructor.
     * @param attributes {object}
     */
    constructor(attributes)
    {
        /**
         * Is this a newly created model, not modified?
         * @type {boolean}
         */
        this.$new = true;

        /**
         * Array of modified attributes.
         * @type {Array<string>}
         */
        this.$modified = [];

        /**
         * Attributes map.
         * @type {{}}
         */
        this.$attributes = {};

        // Call the private init() method.
        init.call(this,attributes);

        // Fill the attribute values.
        this.fill(attributes);
    }

    /**
     * Implementation of factory getter.
     * @throws {Error}
     */
    get $factory()
    {
        throw new Error('unimplemented $factory in Model');
    }

    /**
     * Returns the model schema.
     * @returns {Schema}
     */
    get $schema()
    {
        return this.$factory.schema;
    }

    /**
     * Check if this model has been modified.
     * @returns {boolean}
     */
    get isModified()
    {
        return this.$modified.length > 0;
    }

    /**
     * Fill the given attributes.
     * @param attributes {object}
     */
    fill(attributes)
    {
        _.assign(this.$attributes,attributes);
    }

    /**
     * Inspection method for Node.js.
     * @param depth {Number}
     * @param opts {object}
     * @returns {object}
     */
    inspect(depth,opts)
    {
        return this.toJSON();
    }

    /**
     * Convert the model to attributes.
     * @returns {object}
     */
    toJSON()
    {
        return this.$attributes;
    }
}

/**
 * Assigns and fills the model's attributes.
 * @this {Model}
 * @param attributes {object}
 * @private
 */
function init(attributes)
{
    let factory = this.$factory;

    factory.schema.fields.forEach(field =>
    {
        this.$attributes[field.name] = field.value;

        // Create getters and setters for each field in the schema.
        // When values change, the instance is marked as modified.
        Object.defineProperty(this, field.name, {

            enumerable: true,

            /**
             * Getter, which returns value from attributes hash.
             * @returns {*}
             */
            get()
            {
                return this.$attributes[field.name];
            },

            /**
             * Setter, which sets value in attributes hash.
             * Also, marks model as modified and adds modified property.
             * @param newValue
             */
            set(newValue)
            {
                this.$new = false;
                this.$attributes[field.name] = newValue;

                if (! this.$modified.includes(field.name)) {
                    this.$modified.push(field.name);
                }
            }
        });
    });
}

module.exports = Model;