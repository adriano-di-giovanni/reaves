const { encode } = require('./CreatedAtUtil')
const { MEMBER_SEPARATOR, NULL_CHARACTER } = require('./constants')
const createEvent = require('./createEvent')
const getLoader = require('./getLoader')
const v = require('./validate')

/**
 * Inserts a new event.
 *
 * @function EntityAttribute#insert
 * @param {String} entityId The entity ID.
 * @param {?String} newValue The new value for the attribute.
 * @param {Number} [createdAt=Date.now()] The timestamp of the event.
 * It represents the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
 * @param {Function} done The final callback. Invoked with `(err, event)`
 * @returns {Event} The newly created event. If the current value for the entity with the given ID
 * is the same as the new value, the returned event is related to the current value.
 */
module.exports = function EntityAttribute$insert(entityId, aNewValue, aCreatedAt, aDone) {
    let createdAt
    let done

    if (typeof aCreatedAt === 'function') {
        createdAt = Date.now()
        done = aCreatedAt
    } else {
        createdAt = aCreatedAt
        done = aDone
    }

    if (!v.callback(done, "argument 4, 'done'")) {
        throw v.lastError
    }

    if (!v.entityId(entityId, "argument 1, 'entityId'")) {
        done(v.lastError)
        return
    }

    const canBeNull = this._isNullable
    if (!v.value(aNewValue, canBeNull, "argument 2, 'newValue'")) {
        done(v.lastError)
        return
    }

    if (!v.createdAt(createdAt, "argument 3, 'createdAt'")) {
        done(v.lastError)
        return
    }

    const client = this._client
    createdAt = encode(createdAt)

    getLoader(client).load('insert', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        const newValue = aNewValue || NULL_CHARACTER

        client.evalsha(
            sha,
            0,
            this._keyPrefix,
            this._isCaseSensitive,
            this._isUnique,
            MEMBER_SEPARATOR,
            NULL_CHARACTER,
            entityId,
            newValue,
            createdAt,
            (err, reply) => {
                if (err) {
                    done(err)
                    return
                }

                const [entityId, value, createdAt] = reply

                done(null, createEvent(NULL_CHARACTER, entityId, value, createdAt))
            }
        )
    })
}
