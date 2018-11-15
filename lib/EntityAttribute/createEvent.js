const Event = require('./Event')
const { decode } = require('./CreatedAtUtil')

module.exports = (nullCharacter, entityId, value, createdAt) =>
    Event.create(
        entityId !== nullCharacter ? entityId : null,
        value !== nullCharacter ? value : null,
        decode(createdAt)
    )
