const { MEMBER_SEPARATOR, NULL_CHARACTER } = require('../constants')

module.exports = function(value, canBeNull, description) {
    if (value === null && canBeNull) {
        return true
    }

    if (typeof value !== 'string') {
        this._lastError = new TypeError(
            `Wrong type for ${description}: ${value} is not of type String.`
        )
        return false
    }

    if (value.length === 0) {
        this._lastError = new Error(`Invalid value for ${description}: empty string.`)
        return false
    }

    if (value.indexOf(MEMBER_SEPARATOR) !== -1) {
        this._lastError = new Error(
            `Invalid value for ${description}: ${value} can't contain the character with code ${MEMBER_SEPARATOR.charCodeAt(
                0
            )}`
        )
        return false
    }

    if (value.indexOf(NULL_CHARACTER) !== -1) {
        this._lastError = new Error(
            `Invalid value for ${description}: ${value} can't contain the character with code ${NULL_CHARACTER.charCodeAt(
                0
            )}`
        )
        return false
    }

    return true
}
