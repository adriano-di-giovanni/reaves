const redis = require('redis')

const EntityAttribute = require('../../')

const { ENTITY_NAME, ATTRIBUTE_NAME } = global

const client = redis.createClient()
const entityAttribute = new EntityAttribute(
    client,
    ENTITY_NAME,
    ATTRIBUTE_NAME,
    EntityAttribute.NULLABLE
)

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it("should succeed when argument 2, 'newValue' is null and the entity attribute is nullable", done => {
    const entityId = 'anyEntityId'
    const newValue = null
    const createdAt = Date.now()
    entityAttribute.insert(entityId, newValue, createdAt, done)
})
