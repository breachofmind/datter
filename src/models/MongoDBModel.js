const Model = require('../Model');
const _     = require('lodash');

/**
 * Function which returns the model class, given the model's factory.
 * @param factory {ModelFactory}
 * @returns {MongoDBModel}
 */
module.exports = function model(factory)
{
    return class MongoDBModel extends Model
    {
        /**
         * Returns the factory definition.
         * @returns {ModelFactory}
         */
        get $factory()
        {
            return factory;
        }
    }
};