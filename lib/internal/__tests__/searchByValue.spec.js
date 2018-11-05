const searchByValue = require('../searchByValue')

it('should be defined', () => {
    expect(searchByValue).toBeDefined()
})

it('should be a function', () => {
    expect(typeof searchByValue).toBe('function')
})
