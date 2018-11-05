const getLoader = require('../getLoader')

it('should be defined', () => {
    expect(getLoader).toBeDefined()
})

it('should be a function', () => {
    expect(typeof getLoader).toBe('function')
})
