const Event = require('./Event')
const decodeCreatedAt = require('./decodeCreatedAt')

module.exports = (nullCharacter, entityId, value, createdAt) =>
    Event.create(
        entityId !== nullCharacter ? entityId : null,
        value !== nullCharacter ? value : null,
        decodeCreatedAt(createdAt)
    )
