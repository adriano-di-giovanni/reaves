const redis = require('redis')

const { createProxies } = require('../support')

const isCaseSensitive = true
const isUnique = true
const client = redis.createClient()

const { insert, getEntityId } = createProxies(client, isCaseSensitive, isUnique)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should insert a value and get the ID', done => {
    const entityId = 'anyEntityId'
    const newValue = 'anyNewValue'
    const createdAt = Date.now()

    insert(entityId, newValue, createdAt, err => {
        if (err) {
            done(err)
            return
        }

        getEntityId(newValue, (err, aEntityId) => {
            if (err) {
                done(err)
                return
            }

            expect(aEntityId).toBeDefined()
            expect(aEntityId).toBe(entityId)

            done()
        })
    })
})
