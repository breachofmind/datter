const {MongoDBDriver} = require('../index');
const ModelFactory    = require('../src/ModelFactory');
const Model           = require('../src/Model');
const Schema          = require('../src/Schema');

const DB_NAME = "expressway";
const DB_URL  = "mongodb://localhost:27017/"+DB_NAME;

describe('MongoDBModel.js', () => {

    let driver,factory;

    beforeAll(done => {
        driver = new MongoDBDriver(DB_URL);
        factory = driver.model('Post');
        driver.connect().then(done);
    });

    afterAll(done => {
        driver.disconnect().then(done);
    });

    it("should create correct Model constructor on factory instance", () => {
        expect(factory.model instanceof Function).toBe(true);
        let model = new factory.model({});
        expect(model instanceof Model).toBe(true);
        expect(factory.model.name).toBe('MongoDBModel');
        expect(model.$factory instanceof ModelFactory).toBe(true);
        expect(model.$factory).toBe(factory);
    });

    it("should inherit the schema's fields as attributes", () => {
        factory.schema
            .timestamps()
            .text('title', ['required'])
            .text('content')
            .text('excerpt')

        expect(factory.schema.size).toBe(5);
        let model = factory.create({
            title: "Test",
            content: "lorem ipsum"
        });

        expect(model.title).toBe('Test');
        expect(model.content).toBe('lorem ipsum');
        expect(model.excerpt).toBeNull();
        expect(model.created_at).toBeNull();
        expect(model.modified_at).toBeNull();
        expect(model.notAnAttr).toBeUndefined();
        expect(model.$new).toBe(true);
    });

    it("should log modified fields", () => {
        let model = factory.create({
            title:"new title",
            content:"new content"
        });
        expect(model.isModified).toBe(false);
        expect(model.$new).toBe(true);

        model.title = "changed title";
        expect(model.isModified).toBe(true);
        expect(model.$modified.length).toBe(1);
        expect(model.$modified).toContain('title');
        expect(model.title).toBe('changed title');

        model.content = "changed content";
        expect(model.isModified).toBe(true);
        expect(model.$modified.length).toBe(2);
        expect(model.$modified).toContain('content');
        expect(model.content).toBe('changed content');

        expect(model.$new).toBe(false);
    });
});