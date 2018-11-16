const { createEntityAttribute } = require('./support')
const { generate } = require('randomstring')
const async = require('async')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const client = redis.createClient()
const entityAttribute = createEntityAttribute(client)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it("should return events in ascending order when the 'order' argument is omitted", done => {
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

        entityAttribute.getByEntityId(entityId, (err, events) => {
            if (err) {
                done(err)
                return
            }

            expect(events).toEqual(fixtures)

            done()
        })
    })
})

it('should return events in ascending order', done => {
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

        const order = 'ascending'
        entityAttribute.getByEntityId(entityId, order, (err, events) => {
            if (err) {
                done(err)
                return
            }

            expect(events).toEqual(fixtures)

            done()
        })
    })
})

it('should return events in descending order', done => {
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

        const order = 'descending'
        entityAttribute.getByEntityId(entityId, order, (err, events) => {
            if (err) {
                done(err)
                return
            }

            expect(events).toEqual(fixtures.reverse())

            done()
        })
    })
})
