const { createEntityAttribute } = require('./support')
const { generate } = require('randomstring')
const async = require('async')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const client = redis.createClient()
const entityAttribute = createEntityAttribute(client)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should return the last value', done => {
    const entityId = uuidv4()
    let timestamp = Date.now()
    const fixtures = [
        {
            entityId,
            value: generate(),
            createdAt: timestamp++,
        },
        {
            entityId,
            value: generate(),
            createdAt: timestamp++,
        },
    ]

    const iteratee = ({ entityId, value, createdAt }, callback) =>
        entityAttribute.insert(entityId, value, createdAt, callback)

    async.eachSeries(fixtures, iteratee, err => {
        if (err) {
            done(err)
            return
        }

        entityAttribute.getValue(entityId, (err, value) => {
            if (err) {
                done(err)
                return
            }

            expect(value).toBe(fixtures.pop().value)

            done()
        })
    })
})
