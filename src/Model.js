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
         * Is this a newly created model that hasn't been saved yet?
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

        // Initialize this model.
        fill.call(this,attributes);
    }

    /**
     * Implementation of factory getter.
     * @throws {Error}
     * @returns {Factory}
     */
    get $factory()
    {
        throw new Error('unimplemented getter $factory in Model');
    }

    /**
     * Implementation of factory static getter.
     * @throws {Error}
     * @returns {Factory}
     */
    static get factory()
    {
        throw new Error('unimplemented static getter factory() in Model');
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
function fill(attributes)
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
                this.$attributes[field.name] = newValue;

                if (! this.$modified.includes(field.name)) {
                    this.$modified.push(field.name);
                }
            }
        });

        // Fill the model attributes.
        // But only use attributes that are in the schema.
        if(attributes[field.name]) {
            this.$attributes[field.name] = attributes[field.name];
        }
    });
}

module.exports = Model;