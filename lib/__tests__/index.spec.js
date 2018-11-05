const redis = require('redis')

const EntityAttribute = require('../EntityAttribute')
const reaves = require('../')

const { ENTITY_NAME, ATTRIBUTE_NAME } = global

const client = redis.createClient()

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(reaves).toBeDefined()
})

it('should be a function', () => {
    expect(typeof reaves).toBe('function')
})

it('should return an instance of EntityAttribute', () => {
    const flags = reaves.CASE_SENSITIVE | reaves.NULLABLE | reaves.UNIQUE
    const entityAttribute = reaves(client, ENTITY_NAME, ATTRIBUTE_NAME, flags)
    expect(entityAttribute instanceof EntityAttribute).toBe(true)
})
