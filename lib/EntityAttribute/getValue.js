const { NULL_CHARACTER } = require('./constants')
const getLoader = require('./getLoader')
const v = require('./validate')

/**
 * Asynchronously returns the value of the attribute for the entity with the given ID.
 *
 * @function EntityAttribute#getValue
 * @param {String} entityId The given entity ID.
 * @param {Function} done The final callback. Invoked with `(err, value)`
 * @returns {?String}
 */
module.exports = function EntityAttribute$getValue(entityId, done) {
    if (!v.callback(done, "argument 2, 'done'")) {
        throw v.lastError
    }

    if (!v.entityId(entityId, "argument 1, 'entityId'")) {
        done(v.lastError)
        return
    }

    const client = this._client

    getLoader(client).load('getValue', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        client.evalsha(sha, 0, this._keyPrefix, entityId, (err, value) => {
            if (err) {
                done(err)
                return
            }

            done(null, value !== NULL_CHARACTER ? value : null)
        })
    })
}
