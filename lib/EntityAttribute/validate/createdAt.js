const { MIN_CREATED_AT, MAX_CREATED_AT } = require('../constants')

const toString = Object.prototype.toString

module.exports = function(value, description) {
    if (!/\[object Number\]/.test(toString.call(value))) {
        this._lastError = new TypeError(
            `Wrong type for ${description}: ${value} is not of type Number.`
        )
        return false
    }

    if (value < MIN_CREATED_AT || value > MAX_CREATED_AT) {
        this._lastError = new Error(`Invalid value for ${description}: out of range.`)
        return false
    }

    return true
}
