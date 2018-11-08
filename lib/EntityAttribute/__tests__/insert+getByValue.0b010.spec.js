const { createEntityAttribute, NULLABLE } = require('./support')
const { generate } = require('randomstring')
const async = require('async')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const client = redis.createClient()
const entityAttribute = createEntityAttribute(client, NULLABLE)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should return all events when two entities, the same null value', done => {
    const value = null
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
            createdAt: timestamp++,
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

it('should return all events when two entities, the same non-null value', done => {
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
            createdAt: timestamp++,
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

it('should return all events when two entities, two non-null values that differ by case', done => {
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

it('should return all events when two entities, two different values', done => {
    let timestamp = Date.now()
    const fixtures = [
        {
            entityId: uuidv4(),
            value: generate(),
            createdAt: timestamp++,
        },
        {
            entityId: uuidv4(),
            value: generate(),
            createdAt: timestamp++,
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
        const iteratee = ({ value }, callback) => entityAttribute.getByValue(value, order, callback)

        async.mapSeries(fixtures, iteratee, (err, results) => {
            if (err) {
                done(err)
                return
            }

            expect(results).toEqual([[fixtures[0]], [fixtures[1]]])

            done()
        })
    })
})

it('should return all events in descending order', done => {
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
            entityId,
            value,
            createdAt: timestamp++,
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

            expect(events.map(e => e.createdAt)).toEqual(fixtures.map(f => f.createdAt).reverse())

            done()
        })
    })
})
