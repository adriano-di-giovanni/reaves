/* eslint no-new: 0 */

const redis = require('redis')

const EntityAttribute = require('../')

const { ENTITY_NAME, ATTRIBUTE_NAME } = global

const client = redis.createClient()

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(EntityAttribute).toBeDefined()
})

it('should be a function', () => {
    expect(typeof EntityAttribute).toBe('function')
})

it('should be a constructor', () => {
    const { CASE_SENSITIVE, NULLABLE, UNIQUE } = EntityAttribute
    const flags = CASE_SENSITIVE | NULLABLE | UNIQUE
    const entityAttribute = new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, flags)
    expect(entityAttribute instanceof EntityAttribute).toBe(true)
})

it("should throw when the argument 1, 'client' is not valid", () => {
    expect(() => {
        const client = null
        new EntityAttribute(client)
    }).toThrowError(TypeError, /not of type Object/)
})

it("should throw when the argument 2, 'entityName' is not valid", () => {
    expect(() => {
        const entityName = null
        new EntityAttribute(client, entityName)
    }).toThrowError(TypeError, /not of type String/)
})

it("should throw when the argument 3, 'attributeName' is not valid", () => {
    expect(() => {
        const attributeName = null
        new EntityAttribute(client, ENTITY_NAME, attributeName)
    }).toThrowError(TypeError, /not of type String/)
})

it("should throw when argument 4, 'flags' is not valid", () => {
    expect(() => {
        const flags = null
        new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, flags)
    }).toThrowError(TypeError, /not of type Number/)
})
