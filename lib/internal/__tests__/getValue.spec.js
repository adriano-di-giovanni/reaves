const redis = require('redis')

const getValue = require('../getValue')

const { KEY_PREFIX, NULL_CHARACTER } = global

let client

beforeAll(() => {
    client = redis.createClient()
})

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(getValue).toBeDefined()
})

it('should be a function', () => {
    expect(typeof getValue).toBe('function')
})

it('should return null when the entity with the give ID has no value', done => {
    const entityId = 'anyEntityId'

    getValue(client, KEY_PREFIX, NULL_CHARACTER, entityId, (err, value) => {
        if (err) {
            done(err)
            return
        }

        expect(value).toBeNull()

        done()
    })
})
