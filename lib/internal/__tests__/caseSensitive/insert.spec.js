const async = require('async')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const Event = require('../../Event')
const { createProxies } = require('../support')

const { KEY_PREFIX, MEMBER_SEPARATOR } = global

const isCaseSensitive = true
const isUnique = true
const client = redis.createClient()

const { insert } = createProxies(client, isCaseSensitive, isUnique)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should update all of the redis keys', done => {
    const entityId = 'anyEntityId'
    const newValue = 'anyNewValue'
    const createdAt = Date.now()

    insert(entityId, newValue, createdAt, err => {
        if (err) {
            done(err)
            return
        }
        const batch = client.batch()

        batch
            .zscore(
                `${KEY_PREFIX}:CreatedAtIndex`,
                `${createdAt}${MEMBER_SEPARATOR}${entityId}${MEMBER_SEPARATOR}${newValue}`
            )
            .zscore(
                `${KEY_PREFIX}:EntityIdIndex`,
                `${entityId}${MEMBER_SEPARATOR}${createdAt}${MEMBER_SEPARATOR}${newValue}`
            )
            .hget(`${KEY_PREFIX}:EntityValueMap`, entityId)
            .zscore(
                `${KEY_PREFIX}:ValueIndex`,
                `${newValue}${MEMBER_SEPARATOR}${createdAt}${MEMBER_SEPARATOR}${entityId}`
            )

        batch.exec((err, replies) => {
            if (err) {
                done(err)
                return
            }

            expect(replies[0]).toBe('0')
            expect(replies[1]).toBe('0')
            expect(replies[2]).toBe(newValue)
            expect(replies[3]).toBe('0')

            done()
        })
    })
})

it('should return an event', done => {
    const entityId = 'anyEntityId'
    const newValue = 'anyNewValue'
    const createdAt = Date.now()

    insert(entityId, newValue, createdAt, (err, event) => {
        if (err) {
            done(err)
            return
        }

        expect(event).toBeDefined()
        expect(event instanceof Event).toBe(true)
        expect(event).toEqual({
            entityId,
            value: newValue,
            createdAt,
        })

        done()
    })
})

it('should insert a null value', done => {
    const entityId = 'anyEntityId'
    const newValue = null
    const createdAt = Date.now()

    insert(entityId, newValue, createdAt, done)
})

it('should enforce value uniqueness when exact match', done => {
    const newValue = 'any'
    const now = Date.now()
    async.series(
        [
            callback => {
                const entityId = uuidv4()
                const createdAt = now
                insert(entityId, newValue, createdAt, callback)
            },
            // NOTE: the following should fail
            callback => {
                const entityId = uuidv4()
                const createdAt = now + 1
                insert(entityId, newValue, createdAt, callback)
            },
        ],
        err => {
            expect(err).toBeDefined()
            expect(err instanceof Error).toBe(true)
            expect(err.message).toMatch(/Duplicate value/)

            done()
        }
    )
})

it('should not enforce value uniqueness when differ by case', done => {
    const now = Date.now()
    async.series(
        [
            callback => {
                const entityId = uuidv4()
                const newValue = 'any'
                const createdAt = now
                insert(entityId, newValue, createdAt, callback)
            },
            callback => {
                const entityId = uuidv4()
                const newValue = 'ANY'
                const createdAt = now + 1
                insert(entityId, newValue, createdAt, callback)
            },
        ],
        done
    )
})

it('should be idempotent', done => {
    const entityId = uuidv4()
    const newValue = 'any'
    const now = Date.now()
    async.series(
        [
            callback => {
                const createdAt = now
                insert(entityId, newValue, createdAt, callback)
            },
            callback => {
                const createdAt = now + 1
                insert(entityId, newValue, createdAt, callback)
            },
        ],
        (err, results) => {
            if (err) {
                done(err)
                return
            }

            expect(Event.equal(...results)).toBe(true)

            done()
        }
    )
})
