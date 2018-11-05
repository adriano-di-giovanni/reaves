const redis = require('redis')

const EntityAttribute = require('../../')

const { ENTITY_NAME, ATTRIBUTE_NAME, FLAGS } = global

const client = redis.createClient()
const entityAttribute = new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, FLAGS)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should asynchronously fail when invoked on a non-unique entity attribute', done => {
    const value = 'anyValue'
    entityAttribute.getEntityId(value, err => {
        expect(err).toBeDefined()
        expect(err instanceof Error).toBe(true)
        expect(err.message).toMatch(/Invalid call/)
        done()
    })
})
