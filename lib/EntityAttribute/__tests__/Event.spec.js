const Event = require('../Event')

const entityId = 'anyEntityId'
const value = 'anyValue'
const createdAt = Date.now()

it('should be defined', () => {
    expect(Event).toBeDefined()
})

it('should be a function', () => {
    expect(typeof Event).toBe('function')
})

it('should be a constructor', () => {
    const event = new Event(entityId, value, createdAt)
    expect(event instanceof Event).toBe(true)
})

describe('equals', () => {
    it('should compare value object', () => {
        const e0 = new Event(entityId, value, createdAt)
        const e1 = new Event(entityId, value, createdAt)

        expect(e0.equals(e1)).toBe(true)
    })
})
