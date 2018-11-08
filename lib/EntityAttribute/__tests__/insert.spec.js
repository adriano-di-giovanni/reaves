const redis = require('redis')
const { createEntityAttribute } = require('./support')

const client = redis.createClient()
const entityAttribute = createEntityAttribute(client)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(entityAttribute.insert).toBeDefined()
})

it('should be a function', () => {
    expect(typeof entityAttribute.insert).toBe('function')
})

it("should throw when argument 4, 'done', is not valid", () => {
    expect(() => {
        entityAttribute.insert()
    }).toThrowError(TypeError, /not of type Function/)
})

it("should asynchronously fail when argument 1, 'entityId', is not valid", done => {
    const entityId = null
    const newValue = null
    const createdAt = null
    entityAttribute.insert(entityId, newValue, createdAt, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type String/)
        done()
    })
})

it("should asynchronously fail when argument 2, 'newValue', is not valid", done => {
    const entityId = 'anyEntityId'
    const newValue = null
    const createdAt = null
    entityAttribute.insert(entityId, newValue, createdAt, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type String/)
        done()
    })
})

it("should asynchronously fail when argument 3, 'createdAt', is not valid", done => {
    const entityId = 'anyEntityId'
    const newValue = 'anyNewValue'
    const createdAt = null
    entityAttribute.insert(entityId, newValue, createdAt, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type Number/)
        done()
    })
})
