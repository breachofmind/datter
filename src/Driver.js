const EventEmitter = require('events');
const MongoDB      = require('mongodb');
const Promise      = require('bluebird');
const _            = require('lodash');

const Model              = require('./contracts/Model');
const createModelClass   = require('./Model');
const createFactoryClass = require('./ModelFactory');

class Driver extends EventEmitter
{
    /**
     * Constructor.
     * @param url {string} database connection string
     */
    constructor(url)
    {
        super();

        /**
         * If connected, holds the database connection object.
         * @type {null|MongoDB}
         * @private
         */
        this._db = null;

        /**
         * The URL connection string.
         * @type {string}
         * @private
         */
        this._url = url;

        /**
         * Created model factories.
         * @type {{}}
         * @private
         */
        this._models = {};
    }

    /**
     * Check if the database is connected.
     * @returns {boolean}
     */
    get connected()
    {
        return this._db !== null;
    }

    /**
     * Return the protected database connection.
     * @returns {null|Db}
     */
    get db()
    {
        return this._db;
    }

    /**
     * Return the connection url.
     * @returns {string}
     */
    get url()
    {
        return this._url;
    }

    /**
     * Return the protected models object.
     * @returns {{}}
     */
    get models()
    {
        return this._models;
    }

    /**
     * Connect to the database.
     * @returns {Promise}
     */
    connect()
    {
        if (this.connected) {
            return Promise.resolve(this._db);
        }
        return new Promise((resolve,reject) =>
        {
            MongoDB.MongoClient.connect(this._url, (err,db) => {
                if (err) {
                    this.emit('error', err);
                    return reject(err);
                }
                this._db = db;
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
            return this._db.logout().then(result => {
                this._db = null;
                return result;
            });
        }
        return Promise.resolve(true);
    }


    /**
     * Create a new model with the given schema.
     * @param name {string}
     * @returns {ModelFactory}
     */
    model(name)
    {
        let factory = createFactoryClass(name);

        // Assign a property on the factory the model class constructor.
        Object.defineProperty(factory,'model', {
            value: createModelClass(factory)
        });

        return this._models[name] = factory;
    }
}

module.exports = Driver;