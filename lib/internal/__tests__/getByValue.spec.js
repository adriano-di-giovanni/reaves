const getByValue = require('../getByValue')

it('should be defined', () => {
    expect(getByValue).toBeDefined()
})

it('should be a function', () => {
    expect(typeof getByValue).toBe('function')
})
