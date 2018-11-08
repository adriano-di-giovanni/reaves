const { CREATED_AT_PADDING } = require('./constants')

module.exports = aCreatedAt => {
    const createdAt = aCreatedAt
    if (createdAt >= 0) {
        return createdAt + CREATED_AT_PADDING
    }
    return createdAt - CREATED_AT_PADDING
}
