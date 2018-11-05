const redis = require('redis')

const { createProxies } = require('../support')

const isCaseSensitive = true
const client = redis.createClient()

const { getEntityId } = createProxies(client, isCaseSensitive)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should return null when the given value has no entity', done => {
    const value = 'anyValue'

    getEntityId(value, (err, entityId) => {
        if (err) {
            done(err)
            return
        }

        expect(entityId).toBeNull()

        done()
    })
})
