const redis = require('redis')

const { createProxies } = require('../support')

const isCaseSensitive = true
const client = redis.createClient()

const { getByValue } = createProxies(client, isCaseSensitive)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should return an empty array', done => {
    const value = 'anyValue'
    const order = 'ascending'

    getByValue(value, order, (err, events) => {
        if (err) {
            done(err)
            return
        }

        expect(events).toBeDefined()
        expect(Array.isArray(events)).toBe(true)
        expect(events.length).toBe(0)

        done()
    })
})
