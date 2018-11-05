const { getEntityId } = require('../internal')
const { MEMBER_SEPARATOR } = require('./constants')
const v = require('./validate')

module.exports = function EntityAttribute$getEntityId(value, done) {
    if (!v.callback(done, "argument 2, 'done'")) {
        throw v.lastError
    }

    const canBeNull = false
    if (!v.value(value, canBeNull, "argument 1, 'value'")) {
        done(v.lastError)
        return
    }

    if (!this._isUnique) {
        done(new Error('Invalid call'))
        return
    }

    getEntityId(this._client, this._keyPrefix, this._isCaseSensitive, MEMBER_SEPARATOR, value, done)
}
