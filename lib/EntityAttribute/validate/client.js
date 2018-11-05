const toString = Object.prototype.toString

module.exports = function(value, description) {
    if (!/\[object Object\]/.test(toString.call(value))) {
        this._lastError = new TypeError(
            `Wrong type for ${description}: ${value} is not of type Object.`
        )
        return false
    }

    return true
}
