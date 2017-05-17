class Model
{
    constructor()
    {
        this.$new = true;
        this.$modified = [];
        this.$attributes = {};
    }

    get $factory()
    {
        throw new Error('unimplemented $factory in Model');
    }
}


module.exports = Model;