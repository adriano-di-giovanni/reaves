const { generate } = require('randomstring')
const async = require('async')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const { createProxies } = require('../support')

const isCaseSensitive = false
const isUnique = true
let client = redis.createClient()

const { getByValue, insert } = createProxies(client, isCaseSensitive, isUnique)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should insert many values and retrieve the related events by the given value', done => {
    const entityId = uuidv4()
    const newValue = generate()
    let now = Date.now()
    const fixtures = [
        {
            entityId,
            value: newValue,
            createdAt: now++,
        },
        {
            entityId,
            value: null,
            createdAt: now++,
        },
        {
            entityId: uuidv4(),
            value: newValue,
            createdAt: now++,
        },
        {
            entityId: uuidv4(),
            value: newValue + generate(),
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

        getByValue(newValue, 'ascending', (err, events) => {
            if (err) {
                done(err)
                return
            }

            expect(events).toBeDefined()
            expect(Array.isArray(events)).toBe(true)
            expect(events.length).toBe(3)

            // TODO: should inspect the array values

            done()
        })
    })
})
