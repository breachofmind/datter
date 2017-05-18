const Database = require('../Database');
const MongoDB  = require('mongodb');
const Promise  = require('bluebird');
const modelFn   = require('../models/MongoDBModel');

class MongoDBDriver extends Database
{
    /**
     * Connect to the database.
     * @returns {Promise}
     */
    connect()
    {
        if (this.connected) {
            return Promise.resolve(this.instance);
        }
        return new Promise((resolve,reject) =>
        {
            MongoDB.MongoClient.connect(this.url, (err,db) => {
                if (err) {
                    this.emit('error', err);
                    return reject(err);
                }
                this.instance = db;
                this.emit('connect', db);

                return resolve(db);
            })
        })
    }

    /**
     * Disconnect from the database.
     * @returns {Promise}
     */
    disconnect()
    {
        if (this.connected) {
            return this.instance.logout().then(result => {
                this.instance = null;
                return result;
            });
        }
        return Promise.resolve(true);
    }

    /**
     * Return a class constructor for a model.
     * @param factory {ModelFactory}
     * @returns {Model}
     */
    getModelClass(factory)
    {
        return modelFn(factory);
    }
}

module.exports = MongoDBDriver;