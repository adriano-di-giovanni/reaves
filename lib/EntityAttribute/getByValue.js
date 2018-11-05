const { getByValue } = require('../internal')
const { MEMBER_SEPARATOR, NULL_CHARACTER } = require('./constants')
const v = require('./validate')

module.exports = function EntityAttribute$getByValue(value, order, done) {
    if (!v.callback(done, "argument 3, 'done'")) {
        throw v.lastError
    }

    const canBeNull = this._isNullable
    if (!v.value(value, canBeNull, "argument 1, 'value'")) {
        done(v.lastError)
        return
    }

    if (!v.order(order, "argument 2, 'order'")) {
        done(v.lastError)
        return
    }

    getByValue(
        this._client,
        this._keyPrefix,
        this._isCaseSensitive,
        MEMBER_SEPARATOR,
        NULL_CHARACTER,
        value,
        order,
        done
    )
}
