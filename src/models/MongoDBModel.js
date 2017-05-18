const Model = require('../Model');
const _     = require('lodash');

/**
 * Function which returns the model class, given the model's factory.
 * @param factory {ModelFactory}
 * @param db {MongoDBDriver}
 * @returns {MongoDBModel}
 */
module.exports = function model(factory,db)
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