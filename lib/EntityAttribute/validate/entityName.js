module.exports = function(value, description) {
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

    return true
}
