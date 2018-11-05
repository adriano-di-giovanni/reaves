const v = require('../')

it('should be defined', () => {
    expect(v.value).toBeDefined()
})

it('should be a function', () => {
    expect(typeof v.value).toBe('function')
})

it("should return false when the argument 1, 'value' is null and the argument 2, 'canBeNull' is false", () => {
    const value = null
    const canBeNull = false
    expect(v.value(value, canBeNull)).toBe(false)
})
