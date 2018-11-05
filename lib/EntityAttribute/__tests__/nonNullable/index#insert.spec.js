const redis = require('redis')

const EntityAttribute = require('../../')

const { ENTITY_NAME, ATTRIBUTE_NAME } = global

const client = redis.createClient()
const entityAttribute = new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, 0)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it("should asynchronously fail when argument 2, 'newValue' is null and the entity attribute is not-nullable", done => {
    const entityId = 'anyEntityId'
    const newValue = null
    const createdAt = null
    entityAttribute.insert(entityId, newValue, createdAt, err => {
        expect(err).toBeDefined()
        expect(err instanceof TypeError).toBe(true)
        expect(err.message).toMatch(/not of type String/)
        done()
    })
})
