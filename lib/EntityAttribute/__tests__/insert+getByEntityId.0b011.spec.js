const { createEntityAttribute, CASE_SENSITIVE, NULLABLE } = require('./support')
const async = require('async')
const redis = require('redis')
const uuidv4 = require('uuid/v4')
const { generate } = require('randomstring')

const client = redis.createClient()
const entityAttribute = createEntityAttribute(client, CASE_SENSITIVE | NULLABLE)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should return a single event when two consecutive inserts, twice the same null value', done => {
    const entityId = uuidv4()
    const value = null
    let timestamp = Date.now()
    const fixtures = [
        {
            entityId,
            value,
            createdAt: timestamp++,
        },
        {
            entityId,
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
        entityAttribute.getByEntityId(entityId, order, (err, events) => {
            if (err) {
                done(err)
                return
            }

            expect(events.length).toBe(1)

            done()
        })
    })
})

it('should return all events when two consecutive inserts, null value, non-null value', done => {
    const entityId = uuidv4()
    let timestamp = Date.now()
    const fixtures = [
        {
            entityId,
            value: null,
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

it('should return all events when two consecutive inserts, non-null value, null value', done => {
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
            value: null,
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

it('should return a single event when two consecutive inserts, twice the same non-null value', done => {
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
        entityAttribute.getByEntityId(entityId, order, (err, events) => {
            if (err) {
                done(err)
                return
            }

            expect(events.length).toBe(1)

            done()
        })
    })
})

it('should return all events when two consecutive inserts, two values that differ by case', done => {
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
            value: value.toLowerCase(),
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

it('should return all events when two consecutive inserts, two different values', done => {
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

it('should return all events in descending order', done => {
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
