const Schema = require('../src/Schema');
const Field = require('../src/Field');
const Types = require('../src/support/types.json');
const {MongoDBDriver} = require('../index');

var driver = new MongoDBDriver;
var factory = driver.model('Test');
var schema = factory.schema;

describe("Schema.js", () => {

    it("should create empty instance of a Schema object", () => {
        expect(schema instanceof Schema).toBe(true);
        expect(schema instanceof Map).toBe(true);
        expect(schema.size).toBe(0);
    });

    it("should not allow setting random values", () => {
        function setValue() {
            schema.set('shouldNotWork', 1);
        }
        expect(setValue).toThrow(new TypeError("second argument must be Field instance"));
        expect(schema.size).toBe(0);
    });

    it("should create field instances with default values", () => {
        let FIELD_NAME = "title";
        let FIELD_TYPE = "text";
        schema.field(FIELD_NAME, FIELD_TYPE);
        expect(schema.size).toBe(1);
        let field = schema.get(FIELD_NAME);
        expect(field instanceof Field).toBe(true);
        expect(field.name).toBe(FIELD_NAME);
        expect(field.type).toBe(FIELD_TYPE);
        expect(field.priority).toBe(0);
        expect(field.required).toBe(false);
        expect(field.unique).toBe(false);
    });

    it("should increment the priority based on the map size and allow chaining", () => {
        schema
            .field('description','text')
            .field('excerpt', 'text');

        expect(schema.size).toBe(3);
        expect(getProp('description', 'priority')).toBe(1);
        expect(getProp('excerpt', 'priority')).toBe(2);
    });

    it("should have some helper methods that can be chained and names kebabCased", () => {
        schema
            .timestamps()
            .text('textField')
            .number('numberField')
            .float('floatField')
            .boolean('boolField');

        expect(schema.size).toBe(9);

        expect(getProp('created_at', 'type')).toBe(Types.DATETIME);
        expect(getProp('modified_at', 'type')).toBe(Types.DATETIME);
        expect(getProp('text_field', 'type')).toBe(Types.TEXT);
        expect(getProp('number_field', 'type')).toBe(Types.NUMBER);
        expect(getProp('float_field', 'type')).toBe(Types.FLOAT);
        expect(getProp('bool_field', 'type')).toBe(Types.BOOLEAN);
    });

    it("should create reference fields hasOne() and hasMany()", () => {
        schema.hasOne('user_id','User');
        schema.hasMany('comments', 'Comment');

        let fieldOne = schema.get('user_id');
        let fieldMany = schema.get('comments');

        expect(fieldOne.reference).toBe('User');
        expect(fieldOne.type).toBe(Types.ID);
        expect(fieldMany.reference).toBe('Comment');
        expect(fieldMany.type).toBe(Types.ARRAY);

    });

    it("should allow field to be configured with object", () => {
        schema.text('test_field', {
            required: true,
            unique: true
        });
        let field = schema.get('test_field');
        expect(field.required).toBe(true);
        expect(field.unique).toBe(true);
    });

    it("should allow field to be configured with number which changes priority", () => {
        schema.text('priority_field', 100);

        expect(getProp('priority_field','priority')).toBe(100);
    });

    it("should allow field to be configured with callback", () => {
        let fn = function(field,sch) {
            expect(field instanceof Field).toBe(true);
            expect(sch instanceof Schema).toBe(true);
            expect(schema === sch).toBe(true);
            expect(this).toBe(field);
            expect(this.name).toBe('fn_field');
            expect(this.type).toBe('text');
        };
        schema.text('fn_field', fn);
    });

    it("should allow field boolean values to be configured with strings of property names", () => {
        schema.text('str_field', 'required');
        expect(getProp('str_field', 'required')).toBe(true);
    });

    it("should allow field to be configured with array of values", () => {
        let opts = [
            200,
            'unique',
            'required',
            function(field) {
                field.label = "neat";
            }
        ];

        schema.text('arr_field', opts);
        let field = schema.get('arr_field');

        expect(field.priority).toBe(200);
        expect(field.unique).toBe(true);
        expect(field.required).toBe(true);
        expect(field.label).toBe('neat');
    });

    it("should return array of field instances in priority order with fields property", () => {
        let testSchema = driver.model('Foo')
            .schema
            .text('field_one', 5)
            .text('field_two', 1)
            .text('field_three',7);

        let fields = testSchema.fields;

        expect(Array.isArray(fields)).toBe(true);
        expect(fields.length).toBe(3);
        expect(fields[0]).toBe(testSchema.get('field_two'));
        expect(fields[1]).toBe(testSchema.get('field_one'));
        expect(fields[2]).toBe(testSchema.get('field_three'));
    });

    it("should return a filtered array of fields given parameters", () => {
        let testSchema = driver.model('Bar')
            .schema
            .text('field_one', [1,'required'])
            .text('field_two', [2, 'unique'])
            .number('field_three',[3, 'required', 'unique']);

        let filterOne = testSchema.filter('required');
        let filterTwo = testSchema.filter({type:Types.TEXT});
        let filterThree = testSchema.filter(function(o) {
            return o.priority > 1;
        });
        expect(filterOne.length).toBe(2);
        expect(filterOne[0]).toBe(testSchema.get('field_one'));
        expect(filterOne[1]).toBe(testSchema.get('field_three'));
        expect(filterTwo.length).toBe(2);
        expect(filterTwo[0]).toBe(testSchema.get('field_one'));
        expect(filterTwo[1]).toBe(testSchema.get('field_two'));
        expect(filterThree.length).toBe(2);
        expect(filterThree[0]).toBe(testSchema.get('field_two'));
        expect(filterThree[1]).toBe(testSchema.get('field_three'));
    });
});

/**
 * Helper to get a field and property value from the schema.
 * @param field {string}
 * @param prop {string}
 * @returns {*}
 */
function getProp(field,prop) {
    return schema.get(field) [prop];
}