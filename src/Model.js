const BaseModel = require('./contracts/Model');
const _ = require('lodash');

/**
 * Function which returns the model class, given the model's factory.
 * @param factory {ModelFactory}
 * @returns {Model}
 */
function createModelClass(factory)
{
    class Model extends BaseModel
    {
        constructor(attributes)
        {
            super();

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

            // Fill the values.
            _.assign(this.$attributes,attributes);
        }

        /**
         * Returns the model schema.
         * @returns {Schema}
         */
        get $schema()
        {
            return factory.schema;
        }

        /**
         * Returns the factory definition.
         * @returns {ModelFactory}
         */
        get $factory()
        {
            return factory;
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

    return Model;
}


module.exports = createModelClass;