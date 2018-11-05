const getEntityId = require('../getEntityId')

it('should be defined', () => {
    expect(getEntityId).toBeDefined()
})

it('should be a function', () => {
    expect(typeof getEntityId).toBe('function')
})
