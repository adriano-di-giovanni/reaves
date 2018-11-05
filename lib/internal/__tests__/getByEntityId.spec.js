const redis = require('redis')

const getByEntityId = require('../getByEntityId')

const { KEY_PREFIX, MEMBER_SEPARATOR, NULL_CHARACTER } = global

let client = redis.createClient()

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(getByEntityId).toBeDefined()
})

it('should be a function', () => {
    expect(typeof getByEntityId).toBe('function')
})

it('should return an empty array', done => {
    const entityId = 'anyEntityId'
    const order = 'ascending'

    getByEntityId(
        client,
        KEY_PREFIX,
        MEMBER_SEPARATOR,
        NULL_CHARACTER,
        entityId,
        order,
        (err, events) => {
            if (err) {
                done(err)
                return
            }

            expect(events).toBeDefined()
            expect(Array.isArray(events)).toBe(true)
            expect(events.length).toBe(0)

            done()
        }
    )
})
