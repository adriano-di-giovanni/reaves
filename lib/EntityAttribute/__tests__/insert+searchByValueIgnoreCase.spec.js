const { createEntityAttribute, CASE_SENSITIVE } = require('./support')
const { generate } = require('randomstring')
const async = require('async')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const client = redis.createClient()
const entityAttribute = createEntityAttribute(client, CASE_SENSITIVE)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should search ignoring case', done => {
    const value = generate()
    let timestamp = Date.now()
    const fixtures = [
        {
            entityId: uuidv4(),
            value,
            createdAt: timestamp++,
        },
        {
            entityId: uuidv4(),
            value: value.toLowerCase(),
            createdAt: timestamp++,
        },
        {
            entityId: uuidv4(),
            value: value.toUpperCase(),
            createdAt: timestamp,
        },
    ]

    const iteratee = ({ entityId, value, createdAt }, callback) =>
        entityAttribute.insert(entityId, value, createdAt, callback)

    async.mapSeries(fixtures, iteratee, err => {
        if (err) {
            done(err)
            return
        }

        entityAttribute.searchByValueIgnoreCase(value, (err, events) => {
            if (err) {
                done(err)
                return
            }

            expect(events).toEqual(fixtures)

            done()
        })
    })
})
