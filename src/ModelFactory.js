const BaseModelFactory = require('./contracts/ModelFactory');
const _ = require('lodash');

function createFactoryClass(name)
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
            this.slug = this.table;

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
         * Return the protected model name.
         * @returns {string}
         */
        get name()
        {
            return name;
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

    }
}

module.exports = createFactoryClass;