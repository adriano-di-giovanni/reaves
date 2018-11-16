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
            value,
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

        entityAttribute.getByValue(value, (err, events) => {
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
            value,
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
        entityAttribute.getByValue(value, order, (err, events) => {
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
            value,
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
        entityAttribute.getByValue(value, order, (err, events) => {
            if (err) {
                done(err)
                return
            }

            expect(events).toEqual(fixtures.reverse())

            done()
        })
    })
})
