const redis = require('redis')

const EntityAttribute = require('../')

const { ENTITY_NAME, ATTRIBUTE_NAME, FLAGS } = global

const client = redis.createClient()
const entityAttribute = new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, FLAGS)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(entityAttribute.getByValue).toBeDefined()
})

it('should be a function', () => {
    expect(typeof entityAttribute.getByValue).toBe('function')
})

it("should throw when argument 3, 'done' is not valid", () => {
    expect(() => {
        entityAttribute.getByValue()
    }).toThrowError(TypeError, /not of type Function/)
})

it("should asynchronously fail when argument 1, 'value' is not valid", done => {
    const value = null
    const order = null
    entityAttribute.getByValue(value, order, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type String/)
        done()
    })
})

it("should asynchronously fail when argument 2, 'order' is not valid", done => {
    const value = 'anyValue'
    const order = null
    entityAttribute.getByValue(value, order, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type String/)
        done()
    })
})
