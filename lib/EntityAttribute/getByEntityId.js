const { MAX_ENCODED_CREATED_AT, MIN_ENCODED_CREATED_AT } = require('./CreatedAtUtil')
const { MEMBER_SEPARATOR, NULL_CHARACTER } = require('./constants')
const createEvent = require('./createEvent')
const getLoader = require('./getLoader')
const v = require('./validate')

/**
 * Asynchronously returns all the events that are related to the entity with the given ID.
 *
 * @function EntityAttribute#getByEntityId
 * @param {String} entityId The given entity ID.
 * @param {('ascending'|'descending')} order The order of the returned events.
 * @param {Function} done The final callback. Invoked with `(err, events)`.
 * @returns {Array.<Event>} An array of events representing all the value changes for the
 * entity with the given ID.
 */
module.exports = function EntityAttribute$getByEntityId(entityId, order, done) {
    // TODO: make the order argument optional

    if (!v.callback(done, "argument 3, 'done'")) {
        throw v.lastError
    }

    if (!v.entityId(entityId, "argument 1, 'entityId'")) {
        done(v.lastError)
        return
    }

    if (!v.order(order, "argument 2, 'order'")) {
        done(v.lastError)
        return
    }

    const client = this._client

    getLoader(client).load('getByEntityId', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        client.evalsha(
            sha,
            0,
            this._keyPrefix,
            MEMBER_SEPARATOR,
            entityId,
            MIN_ENCODED_CREATED_AT,
            MAX_ENCODED_CREATED_AT,
            order,
            (err, reply) => {
                if (err) {
                    done(err)
                    return
                }

                const transform = r => {
                    const [entityId, createdAt, value] = r.split(MEMBER_SEPARATOR)
                    return createEvent(NULL_CHARACTER, entityId, value, createdAt)
                }

                done(null, reply.map(transform))
            }
        )
    })
}
