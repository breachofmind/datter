const BaseModelFactory = require('./contracts/ModelFactory');
const _ = require('lodash');

function createFactoryClass(name,schema)
{
    return new class ModelFactory extends BaseModelFactory
    {
        constructor()
        {
            super();

            /**
             * The table or collection name.
             * @type {string}
             */
            this.table = _.snakeCase(name.toLowerCase());

            /**
             * The model slug, if used in a url.
             * @type {string}
             */
            this.slug = _.snakeCase(name);

            /**
             * The singular label for this model.
             * @type {string}
             */
            this.singular = name;

            /**
             * The plural label for this model.
             * @type {string}
             */
            this.plural = name;
        }

        /**
         * Configure the factory properties.
         * @param opts {Object}
         * @returns {ModelFactory}
         */
        configure(opts={})
        {
            _.assign(this,opts);

            return this;
        }

        /**
         * Return the protected model name.
         * @returns {string}
         */
        get name() {
            return name;
        }

        get schema() {
            return schema;
        }
        get fields() {
            return Object.keys(this.schema);
        }
    }
}

module.exports = createFactoryClass;