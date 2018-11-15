const { isInRange } = require('../CreatedAtUtil')

const toString = Object.prototype.toString

module.exports = function(value, description) {
    if (!/\[object Number\]/.test(toString.call(value))) {
        this._lastError = new TypeError(
            `Wrong type for ${description}: ${value} is not of type Number.`
        )
        return false
    }

    if (!isInRange(value)) {
        this._lastError = new Error(`Invalid value for ${description}: out of range.`)
        return false
    }

    return true
}
