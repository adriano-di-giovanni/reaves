const redis = require('redis')

const EntityAttribute = require('../')

const { ENTITY_NAME, ATTRIBUTE_NAME } = global

const client = redis.createClient()

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be non-nullable', () => {
    const flags = 0
    const entityAttribute = new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, flags)
    expect(entityAttribute.isNullable()).toBe(false)
})

it('should be nullable', () => {
    const flags = EntityAttribute.NULLABLE
    const entityAttribute = new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, flags)
    expect(entityAttribute.isNullable()).toBe(true)
})
