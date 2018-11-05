module.exports = function(value, description) {
    if (typeof value !== 'function') {
        this._lastError = new TypeError(
            `Wrong type for ${description}: ${value} is not of type Function.`
        )
        return false
    }

    return true
}
