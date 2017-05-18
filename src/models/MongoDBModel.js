const Promise    = require('bluebird');
const Model      = require('../Model');
const _          = require('lodash');
const Collection = require('../Collection');


/**
 * Function which returns the model class, given the model's factory.
 * @param factory {Factory}
 * @param db {MongoDBDriver}
 * @returns {MongoDBModel}
 */
module.exports = function model(factory,db)
{
    return class MongoDBModel extends Model
    {
        /**
         * Returns the factory definition.
         * @returns {Factory}
         */
        get $factory()
        {
            return factory;
        }

        /**
         * Returns the factory definition.
         * @returns {Factory}
         */
        static get factory()
        {
            return factory;
        }

        static all()
        {
            return table().find({}).toArray().then(newCollection).catch(dbError);
        }
    };

    function table() {
        return db.instance.collection(factory.table);
    }

    function newCollection(documents) {
        return factory.create(documents);
    }

    function dbError(err) {
        throw err;
    }
};