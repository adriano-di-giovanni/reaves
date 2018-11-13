const { MEMBER_SEPARATOR, NULL_CHARACTER } = require('./constants')
const createEvent = require('./createEvent')
const getLoader = require('./getLoader')
const v = require('./validate')

/**
 * Searches for events with a value either equal to the given value or starting with it.
 *
 * @function EntityAttribute#searchByValue
 * @param {?String} value
 * @param {('ascending'|'descending')} order The order of the returned events.
 * @param {Function} done
 * @returns {Array.<Event>} An array of matching events.
 */
module.exports = function EntityAttribute$searchByValue(value, order, done) {
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

    const client = this._client
    const isCaseSensitive = this._isCaseSensitive

    getLoader(client).load('searchByValue', (err, sha) => {
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
