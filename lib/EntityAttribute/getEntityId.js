const { MEMBER_SEPARATOR } = require('./constants')
const getLoader = require('./getLoader')
const v = require('./validate')

/**
 * Asynchronously returns the ID of the entity whose attribute currently has the given value.
 *
 * @function EntityAttribute#getEntityId
 * @param {String} value The given value.
 * @param {Function} done The final callback. Invoked with `(err, entityId)`.
 * @returns {?String}
 */
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

    const client = this._client

    getLoader(client).load('getEntityId', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        client.evalsha(
            sha,
            0,
            this._keyPrefix,
            this._isCaseSensitive,
            MEMBER_SEPARATOR,
            value,
            done
        )
    })
}
