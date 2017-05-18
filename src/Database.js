const EventEmitter = require('events');
const Model        = require('./Model');
const Factory      = require('./Factory');
const _            = require('lodash');

class Database extends EventEmitter
{
    /**
     * Constructor.
     * @param url {string} database connection string
     */
    constructor(url)
    {
        super();

        /**
         * If connected, holds the database connection instance.
         * @type {null|*}
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
         * Created model classes.
         * @type {{}}
         * @private
         */
        this._models = {};

        /**
         * Created factory definitions.
         * @type {{}}
         * @private
         */
        this._factories = {};
    }



    /**
     * Check if the database is connected.
     * @returns {boolean}
     */
    get isConnected()
    {
        return this._db !== null;
    }

    /**
     * Return the protected database connection.
     * @returns {null|Db}
     */
    get instance()
    {
        return this._db;
    }

    /**
     * Set the database instance.
     * @param value {null|Db}
     */
    set instance(value)
    {
        this._db = value;
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
     * Return the protected models map.
     * @returns {{}}
     */
    get models()
    {
        return this._models;
    }

    /**
     * Return the protected factories map.
     * @returns {{}}
     */
    get factories()
    {
        return this._factories;
    }

    /**
     * Return an array of model factories.
     * @returns {Array<ModelFactory>}
     */
    toArray()
    {
        return _.map(this._models, (value,key) => {
            return value;
        });
    }

    /**
     * Connect to the database.
     * @returns {Promise}
     */
    connect()
    {
        throw new Error('Database.connect() not implemented');
    }

    /**
     * Disconnect from the database.
     * @returns {Promise}
     */
    disconnect()
    {
        throw new Error('Database.disconnect() not implemented');
    }

    /**
     * Return a class constructor for a model.
     * @param factory {ModelFactory}
     * @returns {Model}
     */
    getModelClass(factory)
    {
        throw new Error('Database.getModelClass() not implemented');
    }

    /**
     * Create a new model with the given schema.
     * @param name {string}
     * @param fn {Function}
     * @returns {Factory}
     */
    model(name, fn)
    {
        let factory = new Factory(name, this);

        // Call the configuration function, if provided.
        if (typeof fn === 'function') {
            fn.call(factory,factory.schema);
        }
        this._models[factory.name] = factory.model;
        this._factories[factory.name] = factory;

        return factory;
    }
}

module.exports = Database;