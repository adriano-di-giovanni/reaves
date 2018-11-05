class Event {
    constructor(entityId, value, createdAt) {
        this.entityId = entityId
        this.value = value
        this.createdAt = createdAt
    }

    equals(aObject) {
        return Event.equal(this, aObject)
    }
}

Event.create = (entityId, value, createdAt) => {
    return Object.freeze(new Event(entityId, value, createdAt))
}

Event.equal = (e0, e1) => {
    return (
        e0 instanceof Event &&
        e1 instanceof Event &&
        e0.entityId === e1.entityId &&
        e0.value === e1.value &&
        e0.createdAt === e1.createdAt
    )
}

module.exports = Event
