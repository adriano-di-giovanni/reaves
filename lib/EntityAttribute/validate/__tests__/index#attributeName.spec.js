const v = require('../')

it('should be defined', () => {
    expect(v.attributeName).toBeDefined()
})

it('should be a function', () => {
    expect(typeof v.attributeName).toBe('function')
})

it('should return false when the value if not of type string', () => {
    expect(v.attributeName()).toBe(false)
})

it('should return false when the value if an empty string', () => {
    expect(v.attributeName('')).toBe(false)
})

it('should return true when the value is valid', () => {
    expect(v.attributeName('anyAttribute')).toBe(true)
})
