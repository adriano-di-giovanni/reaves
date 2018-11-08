const redis = require('redis')

const EntityAttribute = require('../EntityAttribute')
const { createEntityAttribute, CASE_SENSITIVE, NULLABLE, UNIQUE } = require('../')

const { ENTITY_NAME, ATTRIBUTE_NAME } = global

const client = redis.createClient()

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(createEntityAttribute).toBeDefined()
})

it('should be a function', () => {
    expect(typeof createEntityAttribute).toBe('function')
})

it('should asynchronously return an instance of EntityAttribute', done => {
    const flags = CASE_SENSITIVE | NULLABLE | UNIQUE
    createEntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, flags, (err, entityAttribute) => {
        if (err) {
            done(err)
            return
        }

        expect(entityAttribute).toBeDefined()
        expect(entityAttribute instanceof EntityAttribute).toBe(true)

        done()
    })
})
