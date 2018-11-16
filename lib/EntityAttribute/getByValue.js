const { MAX_ENCODED_CREATED_AT, MIN_ENCODED_CREATED_AT } = require('./CreatedAtUtil')
const { MEMBER_SEPARATOR, NULL_CHARACTER } = require('./constants')
const createEvent = require('./createEvent')
const getLoader = require('./getLoader')
const v = require('./validate')

/**
 * Asynchronously returns all the events that are related to the given value.
 *
 * @function EntityAttribute#getByValue
 * @param {?String} value The given value.
 * @param {('ascending'|'descending')} order The order of the returned events.
 * @param {Function} done The final callback. Invoked with `(err, events)`.
 * @return {Array.<Event>} An array of events representing all the entities whose attribute had/has
 * the given value.
 */
module.exports = function EntityAttribute$getByValue(aValue, order, done) {
    // TODO: make the order argument optional

    if (!v.callback(done, "argument 3, 'done'")) {
        throw v.lastError
    }

    const canBeNull = this._isNullable
    if (!v.value(aValue, canBeNull, "argument 1, 'value'")) {
        done(v.lastError)
        return
    }

    if (!v.order(order, "argument 2, 'order'")) {
        done(v.lastError)
        return
    }

    const value = aValue || NULL_CHARACTER

    const client = this._client
    const isCaseSensitive = this._isCaseSensitive

    getLoader(client).load('getByValue', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        client.evalsha(
            sha,
            0,
            this._keyPrefix,
            isCaseSensitive,
            MEMBER_SEPARATOR,
            value,
            MIN_ENCODED_CREATED_AT,
            MAX_ENCODED_CREATED_AT,
            order,
            (err, reply) => {
                if (err) {
                    done(err)
                    return
                }

                // TODO: move to constructor
                const transform = isCaseSensitive
                    ? r => {
                          const [value, createdAt, entityId] = r.split(MEMBER_SEPARATOR)
                          return createEvent(NULL_CHARACTER, entityId, value, createdAt)
                      }
                    : r => {
                          const [createdAt, entityId, value] = r.split(MEMBER_SEPARATOR).slice(1)
                          return createEvent(NULL_CHARACTER, entityId, value, createdAt)
                      }

                done(null, reply.map(transform))
            }
        )
    })
}
