const Event = require('./Event')

module.exports = (nullCharacter, entityId, value, createdAt) =>
    Event.create(
        entityId !== nullCharacter ? entityId : null,
        value !== nullCharacter ? value : null,
        +createdAt
    )
