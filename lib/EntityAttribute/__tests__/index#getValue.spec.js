const redis = require('redis')

const EntityAttribute = require('../')

const { ENTITY_NAME, ATTRIBUTE_NAME, FLAGS } = global

const client = redis.createClient()
const entityAttribute = new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, FLAGS)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(entityAttribute.getValue).toBeDefined()
})

it('should be a function', () => {
    expect(typeof entityAttribute.getValue).toBe('function')
})

it("should throw when argument 2, 'done', is not valid", () => {
    expect(() => {
        entityAttribute.getValue()
    }).toThrowError(TypeError, /not of type Function/)
})

it("should asynchronously fail when argument 1, 'entityId', is not valid", done => {
    const entityId = null
    entityAttribute.getValue(entityId, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type String/)
        done()
    })
})
