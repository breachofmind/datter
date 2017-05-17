const EventEmitter = require('events');

class ModelFactory extends EventEmitter
{
    create(attributes)
    {
        let object = new (this.model)(attributes);

        this.emit('create', object);

        return object;
    }
}

module.exports = ModelFactory;