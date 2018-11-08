const redis = require('redis')

const EntityAttribute = require('../')

const { ENTITY_NAME, ATTRIBUTE_NAME } = global

const client = redis.createClient()

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be case-insensitive', () => {
    const flags = 0
    const entityAttribute = new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, flags)
    expect(entityAttribute.isCaseSensitive()).toBe(false)
})

it('should be case-sensitive', () => {
    const flags = EntityAttribute.CASE_SENSITIVE
    const entityAttribute = new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, flags)
    expect(entityAttribute.isCaseSensitive()).toBe(true)
})
