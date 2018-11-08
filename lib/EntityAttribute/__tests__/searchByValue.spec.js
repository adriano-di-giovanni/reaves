const redis = require('redis')
const { createEntityAttribute } = require('./support')

const client = redis.createClient()
const entityAttribute = createEntityAttribute(client)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(entityAttribute.searchByValue).toBeDefined()
})

it('should be a function', () => {
    expect(typeof entityAttribute.searchByValue).toBe('function')
})

it("should throw when argument 3, 'done' is not valid", () => {
    expect(() => {
        entityAttribute.searchByValue()
    }).toThrowError(TypeError, /not of type Function/)
})

it("should asynchronously fail when argument 1, 'value' is not valid", done => {
    const value = null
    const order = null
    entityAttribute.searchByValue(value, order, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type String/)
        done()
    })
})

it("should asynchronously fail when argument 2, 'order' is not valid", done => {
    const value = 'anyValue'
    const order = null
    entityAttribute.searchByValue(value, order, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type String/)
        done()
    })
})

it('should return an empty array', done => {
    const value = 'anyValue'
    const order = 'ascending'
    entityAttribute.searchByValue(value, order, (err, events) => {
        if (err) {
            done(err)
            return
        }
        expect(events).toBeDefined()
        expect(Array.isArray(events)).toBe(true)
        expect(events).toEqual([])

        done()
    })
})
