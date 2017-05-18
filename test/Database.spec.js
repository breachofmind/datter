const {MongoDBDriver} = require('../index');
const ModelFactory    = require('../src/ModelFactory');
const Model           = require('../src/Model');
const Schema          = require('../src/Schema');

const DB_NAME = "expressway";
const DB_URL  = "mongodb://localhost:27017/"+DB_NAME;

describe('MongoDBDriver.js', function()
{
    let driver;

    // Be sure to disconnect from the database when cleaning up.
    afterAll(done => {
        if (driver) {
            driver.disconnect().then(done);
        }
    });

    it("is an instance of Database", () => {
        driver = new MongoDBDriver(DB_URL);
        expect(MongoDBDriver instanceof Function).toBe(true);
        expect(driver instanceof MongoDBDriver).toBe(true);
    });

    it("should connect to database", (done) =>
    {
        expect(driver.url).toEqual(DB_URL);

        driver.connect().then(db =>
        {
            expect(driver.connected).toBe(true);
            expect(db.databaseName).toEqual(DB_NAME);
            done();
        }).catch(err => {
            done.fail(err);
        })
    });

    it("should disconnect", (done) =>
    {
        expect(driver.connected).toBe(true);
        driver.disconnect().then(result => {
            expect(driver.connected).toBe(false);
            expect(result).toBe(true);
            done();
        }).catch(err => {
            done.fail(err);
        })
    });

    it("should connect and emit events", (done) =>
    {
        let value = false;
        expect(driver.connected).toEqual(false);
        function testEvent() {
            value = true;
        }
        driver.on('connect',testEvent);
        driver.connect().then(db => {
            expect(value).toEqual(true);
            done();
        })
    });
});

describe('MongoDBDriver.js Model factory', function()
{
    let driver,factory;
    let testModelName = "Post";

    beforeAll(done => {
        driver = new MongoDBDriver(DB_URL);
        driver.connect().then(done);
    });
    afterAll(done => {
        driver.disconnect().then(done);
    });

    it("should create a model factory class", () => {
        factory = driver.model(testModelName);
        expect(factory instanceof ModelFactory).toBe(true);
        expect(factory.name).toEqual(testModelName);
        expect(driver.models[testModelName]).toEqual(factory);
    });
    it("should create a schema instance in the factory", () => {
        expect(factory.schema instanceof Schema).toBe(true);
    });

    it("should create a model constructor on the factory instance", () => {
        expect(factory.model).not.toBeUndefined();
        expect(typeof factory.model).toEqual("function");
    });

    it("should create model instances with create() method", () => {
        let model = factory.create();
        expect(model instanceof Model).toBe(true);
        expect(model instanceof factory.model).toBe(true);
        expect(model.$factory).toBe(factory);
    });
});