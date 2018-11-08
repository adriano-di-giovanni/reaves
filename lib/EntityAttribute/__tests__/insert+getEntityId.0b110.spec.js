const { createEntityAttribute, NULLABLE, UNIQUE } = require('./support')
const { generate } = require('randomstring')
const async = require('async')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const client = redis.createClient()
const entityAttribute = createEntityAttribute(client, NULLABLE | UNIQUE)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should return the last entity ID', done => {
    const entityId = uuidv4()
    const value = generate()
    let timestamp = Date.now()
    const fixtures = [
        {
            entityId,
            value,
            createdAt: timestamp++,
        },
        {
            entityId,
            value: null,
            createdAt: timestamp++,
        },
        {
            entityId: uuidv4(),
            value,
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

        entityAttribute.getEntityId(value, (err, entityId) => {
            if (err) {
                done(err)
                return
            }

            expect(entityId).toEqual(fixtures.pop().entityId)

            done()
        })
    })
})
