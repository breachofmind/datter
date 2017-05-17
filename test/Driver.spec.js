const Driver = require('../src/Driver');
const DB_NAME = "expressway";
const DB_URL = "mongodb://localhost:27017/"+DB_NAME;
const ModelFactory = require('../src/contracts/ModelFactory');
const Model = require('../src/contracts/Model');

describe('Driver.js', function()
{
    let driver;

    // Be sure to disconnect from the database when cleaning up.
    afterAll(done => {
        if (driver) {
            driver.disconnect().then(done);
        }
    });

    it("is an instance of Driver", () => {
        expect(Driver instanceof Function).toBe(true);
    });

    it("should connect to database", (done) =>
    {
        driver = new Driver(DB_URL);

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

describe('Driver.js Model factory', function()
{
    let driver,factory;
    let testModelName = "Post";
    let testSchema = {
        title: String,
        slug: String,
        author: Number
    };
    beforeAll(done => {
        driver = new Driver(DB_URL);
        driver.connect().then(done);
    });
    afterAll(done => {
        driver.disconnect().then(done);
    });

    it("should create a model factory class", () => {
        factory = driver.model(testModelName,testSchema);
        expect(factory instanceof ModelFactory).toBe(true);
        expect(factory.name).toEqual(testModelName);
        expect(driver.models[testModelName]).toEqual(factory);
    });

    it("should create a model constructor on the factory instance", () => {
        expect(factory.model).not.toBeUndefined();
        expect(typeof factory.model).toEqual("function")
    });

    it("should create model instances with create() method", () => {
        let model = factory.create();
        expect(model instanceof Model).toBe(true);
    });
});