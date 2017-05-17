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

            factory.fields.forEach(field =>
            {
                this.$attributes[field] = null;

                Object.defineProperty(this, field, {
                    enumerable: true,
                    get()
                    {
                        return this.$attributes[field] || null;
                    },

                    set(newValue)
                    {
                        this.$new = false;
                        this.$attributes[field] = newValue;

                        if (! this.$modified.includes(field)) {
                            this.$modified.push(field);
                        }
                    }
                });
            });

            _.assign(this.$attributes,attributes);
        }

        get $factory()
        {
            return factory;
        }

        get isModified()
        {
            return this.$modified.length > 0;
        }

        inspect(depth,opts)
        {
            return this.toJSON();
        }

        toJSON()
        {
            return this.$attributes;
        }
    }

    return Model;
}

module.exports = createModelClass;