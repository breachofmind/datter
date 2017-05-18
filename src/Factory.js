const EventEmitter = require('events');
const Schema       = require('./Schema');
const Collection   = require('./Collection');
const _            = require('lodash');

class Factory extends EventEmitter
{
    /**
     * Constructor.
     * @param name {string}
     * @param db {Database}
     */
    constructor(name,db)
    {
        super();

        /**
         * The name of the model.
         * This can not be changed once it is set.
         * @type {string}
         */
        Object.defineProperty(this, 'name', {
            value: name
        });

        /**
         * The parent database driver.
         * @type {Database}
         */
        Object.defineProperty(this, 'db', {
            value: db
        });

        /**
         * Every base model has a new schema associated with it.
         * @type {Schema}
         */
        Object.defineProperty(this, 'schema', {
            value: new Schema(this)
        });

        /**
         * Create a Model class constructor.
         * @type {Function}
         */
        Object.defineProperty(this, 'model', {
            value: db.getModelClass(this)
        });

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
     * Create a new model(s) with given attributes.
     * @param attributes {object}
     * @returns {Model|Collection}
     */
    create(attributes={})
    {
        if (Array.isArray(attributes)) {
            return new Collection(attributes.map(attrs => {
                return this.create(attrs);
            }));
        }
        let object = new (this.model)(attributes);

        this.emit('create', object);

        return object;
    }

    /**
     * Configure the factory properties.
     * @param opts {Object}
     * @returns {Factory}
     */
    configure(opts={})
    {
        _.assign(this,opts);

        return this;
    }

}


module.exports = Factory;