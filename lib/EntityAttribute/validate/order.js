module.exports = function(value, description) {
    if (typeof value !== 'string') {
        this._lastError = new TypeError(
            `Wrong type for ${description}: ${value} is not of type String.`
        )
        return false
    }

    if (!/^(ascending|descending)$/.test(value)) {
        this._lastError = new Error(
            `Invalid value for ${description}: valid values are 'ascending' and 'descending'`
        )
        return false
    }

    return true
}
