const EventEmitter = require('events');
const Schema = require('../Schema');

class ModelFactory extends EventEmitter
{
    constructor()
    {
        super();

        /**
         * Every base model has a new schema associated with it.
         * @type {Schema}
         */
        Object.defineProperty(this, 'schema', {
            value: new Schema(this)
        });
    }

    /**
     * Create a new model with given attributes.
     * @param attributes {object}
     * @returns {Model}
     */
    create(attributes={})
    {
        let object = new (this.model)(attributes);

        this.emit('create', object);

        return object;
    }
}

module.exports = ModelFactory;