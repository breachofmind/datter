const Collection = require('../src/Collection');
const Model = require('../src/Model');
const {MongoDBDriver} = require('../index');

var testObjects = [
    {a: "one", b:"one"},
    {a: "two", b:"two"},
    {a: "three", b:"three"}
];


describe('Collection.js', () => {

    let driver,factory;

    it("should be an instance of Array", () => {
        let collection = new Collection;
        expect(collection instanceof Array).toBe(true);
        expect(Array.isArray(collection)).toBe(true);
    });

    it("should create empty collection when not passing args", () => {
        let collection = new Collection;
        expect(collection.length).toBe(0);
        expect(collection.isEmpty).toBe(true);
        expect(collection.factory).toBeNull();
        expect(collection.model).toBeNull();
    });

    it("should throw if given non-model instances", () => {
        function instantiateWithNums() {
            new Collection([1,2,3]);
        }
        function instantiateWithObjects() {
            new Collection([{test: 1}, {test: 1}]);
        }

        expect(instantiateWithNums).toThrow();
        expect(instantiateWithObjects).toThrow();
    });

    it("should only allow adding Model instances", () => {
        driver = new MongoDBDriver;
        factory = driver.model('Test', schema => {
            schema.text('a');
            schema.text('b');
        });

        let testModels = [
            factory.create(testObjects[0]),
            factory.create(testObjects[1]),
        ];
        let collection = new Collection;
        function addToCollection() {
            collection.add(testModels);
        }

        expect(addToCollection).not.toThrow();
        expect(collection.length).toBe(2);
        expect(collection[0]).toBe(testModels[0]);
        expect(collection[1]).toBe(testModels[1]);
    });

    it("factory.create() should return collection if given array of objects", () => {
        let collection = factory.create(testObjects);
        expect(collection instanceof Collection).toBe(true);
        expect(collection.length).toBe(3);
    });

    it("should reference the first items factory and model definition", () => {
        let collection = factory.create(testObjects);
        expect(collection.factory).toBe(factory);
        expect(collection.model).toBe(factory.model);
    });

    it("should throw if attempting to add different model to collection", () => {
        let fooFactory = driver.model('Foo', schema => {
            schema.text('c');
            schema.text('d');
        });
        let collection = factory.create(testObjects);
        let differentModel = fooFactory.create({
            c: "four",
            d: "four",
        });
        function addToCollection() {
            collection.add(differentModel);
        }

        expect(addToCollection).toThrow();
        expect(collection.length).toBe(3);
    });

    it("should not add another instance of a model to a collection if it exists", () => {
        let collection = factory.create(testObjects);
        let model = collection[0];

        expect(collection.length).toBe(3);
        collection.add(model);
        // Shouldnt change
        expect(collection.length).toBe(3);
    });
});