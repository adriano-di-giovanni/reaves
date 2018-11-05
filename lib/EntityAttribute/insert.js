const { MEMBER_SEPARATOR, NULL_CHARACTER } = require('./constants')
const { insert } = require('../internal')
const v = require('./validate')

module.exports = function EntityAttribute$insert(entityId, newValue, createdAt, done) {
    if (!v.callback(done, "argument 4, 'done'")) {
        throw v.lastError
    }

    if (!v.entityId(entityId, "argument 1, 'entityId'")) {
        done(v.lastError)
        return
    }

    const canBeNull = this._isNullable
    if (!v.value(newValue, canBeNull, "argument 2, 'newValue'")) {
        done(v.lastError)
        return
    }

    if (!v.createdAt(createdAt, "argument 3, 'createdAt'")) {
        done(v.lastError)
        return
    }

    insert(
        this._client,
        this._keyPrefix,
        this._isCaseSensitive,
        this._isUnique,
        MEMBER_SEPARATOR,
        NULL_CHARACTER,
        entityId,
        newValue,
        createdAt,
        done
    )
}
