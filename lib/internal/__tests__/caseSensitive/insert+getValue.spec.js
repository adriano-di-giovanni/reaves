const redis = require('redis')

const { createProxies } = require('../support')

const isCaseSensitive = true
const isUnique = true
const client = redis.createClient()

const { getValue, insert } = createProxies(client, isCaseSensitive, isUnique)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should insert and get a value for the entity with the given ID', done => {
    const entityId = 'anyEntityId'
    const newValue = 'anyNewValue'
    const createdAt = Date.now()

    insert(entityId, newValue, createdAt, err => {
        if (err) {
            done(err)
            return
        }

        getValue(entityId, (err, value) => {
            if (err) {
                done(err)
                return
            }

            expect(value).toBe(newValue)

            done()
        })
    })
})

it('should insert and get a null value for the entity with the given ID', done => {
    const entityId = 'anyEntityId'
    const newValue = null
    const createdAt = Date.now()

    insert(entityId, newValue, createdAt, err => {
        if (err) {
            done(err)
            return
        }

        getValue(entityId, (err, value) => {
            if (err) {
                done(err)
                return
            }

            expect(value).toBe(newValue)

            done()
        })
    })
})
