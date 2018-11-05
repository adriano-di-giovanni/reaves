const { generate } = require('randomstring')
const async = require('async')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const { createProxies } = require('../support')

const isCaseSensitive = false
const isUnique = true
let client = redis.createClient()

const { getByEntityId, insert } = createProxies(client, isCaseSensitive, isUnique)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should insert many values and retrieve them all', done => {
    const entityId = uuidv4()
    let now = Date.now()
    const fixtures = [
        {
            entityId,
            value: generate(),
            createdAt: now++,
        },
        {
            entityId,
            value: generate(),
            createdAt: now++,
        },
        {
            entityId: uuidv4(),
            value: generate(),
            createdAt: now++,
        },
        {
            entityId,
            value: null,
            createdAt: now++,
        },
    ]

    const iteratee = ({ entityId, value, createdAt }, callback) =>
        insert(entityId, value, createdAt, callback)

    async.eachSeries(fixtures, iteratee, err => {
        if (err) {
            done(err)
            return
        }

        getByEntityId(entityId, 'ascending', (err, events) => {
            if (err) {
                done(err)
                return
            }

            expect(events).toBeDefined()
            expect(Array.isArray(events)).toBe(true)
            expect(events.length).toBe(3)
            expect(events[0]).toEqual(fixtures[0])
            expect(events[1]).toEqual(fixtures[1])
            expect(events[2]).toEqual(fixtures[3])

            done()
        })
    })
})
