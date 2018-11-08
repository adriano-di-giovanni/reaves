/**
 * A [value object](https://en.wikipedia.org/wiki/Value_object) that represents an event.
 *
 * A single event or an array of events are returned by many methods of {@link EntityAttribute}.
 *
 * **You can't instantiate an {@link Event} yourself.**
 *
 * @hideconstructor
 */
class Event {
    constructor(entityId, value, createdAt) {
        /**
         * The ID of the entity.
         *
         * @member {String}
         */
        this.entityId = entityId

        /**
         * The value of the attribute.
         *
         * @member {String}
         */
        this.value = value

        /**
         * The timestamp of the event.
         * It represents the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
         *
         * @member {Number}
         */
        this.createdAt = createdAt
    }

    /**
     * Compares this event to the given object. The result is true if and only if the argument
     * is defined and is an Event object that represents the same `(entityId, value, createdAt)`.
     */
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
