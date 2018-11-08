const redis = require('redis')
const { createEntityAttribute } = require('./support')

const client = redis.createClient()
const entityAttribute = createEntityAttribute(client)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(entityAttribute.getEntityId).toBeDefined()
})

it('should be a function', () => {
    expect(typeof entityAttribute.getEntityId).toBe('function')
})

it("should throw when argument 2, 'done', is not valid", () => {
    expect(() => {
        entityAttribute.getEntityId()
    }).toThrowError(TypeError, /not of type Function/)
})

it("should asynchronously fail when argument 1, 'value', is not valid", done => {
    const value = null
    entityAttribute.getEntityId(value, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type String/)
        done()
    })
})
