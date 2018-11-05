module.exports = function(value, description) {
    if (typeof value !== 'number') {
        this._lastError = new TypeError(`Wrong type for ${description}: ${value} is not a number.`)
        return false
    }

    return true
}
