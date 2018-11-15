const { createEntityAttribute, CASE_SENSITIVE } = require('./support')
const { generate } = require('randomstring')
const async = require('async')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const client = redis.createClient()
const entityAttribute = createEntityAttribute(client, CASE_SENSITIVE)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should insert', done => {
    const entityId = uuidv4()
    const newValue = generate()
    const createdAt = Date.now()

    entityAttribute.insert(entityId, newValue, createdAt, done)
})

it('should be idempotent when two consecutive inserts, one entity, same non-null value', done => {
    const entityId = uuidv4()
    const newValue = generate()
    let timestamp = Date.now()

    const fixtures = [
        {
            entityId,
            value: newValue,
            createdAt: timestamp++,
        },
        {
            entityId,
            value: newValue,
            createdAt: timestamp,
        },
    ]

    const iteratee = ({ entityId, value, createdAt }, callback) =>
        entityAttribute.insert(entityId, value, createdAt, callback)

    async.mapSeries(fixtures, iteratee, (err, results) => {
        if (err) {
            done(err)
            return
        }

        expect(results).toEqual([fixtures[0], fixtures[0]])

        done()
    })
})

it('should succeed when two consecutive inserts, one entity, two values that only differ by case', done => {
    const entityId = uuidv4()
    const newValue = generate()
    let timestamp = Date.now()

    const fixtures = [
        {
            entityId,
            value: newValue,
            createdAt: timestamp++,
        },
        {
            entityId,
            value: newValue.toLowerCase(),
            createdAt: timestamp++,
        },
    ]

    const iteratee = ({ entityId, value, createdAt }, callback) =>
        entityAttribute.insert(entityId, value, createdAt, callback)

    async.mapSeries(fixtures, iteratee, (err, results) => {
        if (err) {
            done(err)
            return
        }

        expect(results).toEqual(fixtures)

        done()
    })
})

it('should succeed when two consecutive inserts, one entity, two different values', done => {
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

    async.mapSeries(fixtures, iteratee, (err, results) => {
        if (err) {
            done(err)
            return
        }

        expect(results).toEqual(fixtures)

        done()
    })
})

it('should succeed when two consecutive inserts, two entities, same non-null value', done => {
    const newValue = generate()
    let timestamp = Date.now()

    const fixtures = [
        {
            entityId: uuidv4(),
            value: newValue,
            createdAt: timestamp++,
        },
        {
            entityId: uuidv4(),
            value: newValue,
            createdAt: timestamp++,
        },
    ]

    const iteratee = ({ entityId, value, createdAt }, callback) =>
        entityAttribute.insert(entityId, value, createdAt, callback)

    async.mapSeries(fixtures, iteratee, (err, results) => {
        if (err) {
            done(err)
            return
        }

        expect(results).toEqual(fixtures)

        done()
    })
})

it('should succeed when two consecutive inserts, two entities, two values that only differ by case', done => {
    const newValue = generate()
    let timestamp = Date.now()

    const fixtures = [
        {
            entityId: uuidv4(),
            value: newValue,
            createdAt: timestamp++,
        },
        {
            entityId: uuidv4(),
            value: newValue.toLowerCase(),
            createdAt: timestamp++,
        },
    ]

    const iteratee = ({ entityId, value, createdAt }, callback) =>
        entityAttribute.insert(entityId, value, createdAt, callback)

    async.mapSeries(fixtures, iteratee, (err, results) => {
        if (err) {
            done(err)
            return
        }

        expect(results).toEqual(fixtures)

        done()
    })
})

it('should succeed when two consecutive inserts, two entities, two different values', done => {
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

    async.mapSeries(fixtures, iteratee, (err, results) => {
        if (err) {
            done(err)
            return
        }

        expect(results).toEqual(fixtures)

        done()
    })
})

it('should asynchronously fail when one insert, one entity, null value', done => {
    const entityId = uuidv4()
    const newValue = null
    const createdAt = Date.now()
    entityAttribute.insert(entityId, newValue, createdAt, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type String/)

        done()
    })
})
