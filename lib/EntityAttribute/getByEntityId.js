const { getByEntityId } = require('../internal')
const { MEMBER_SEPARATOR, NULL_CHARACTER } = require('./constants')
const v = require('./validate')

module.exports = function EntityAttribute$getByEntityId(entityId, order, done) {
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

    getByEntityId(
        this._client,
        this._keyPrefix,
        MEMBER_SEPARATOR,
        NULL_CHARACTER,
        entityId,
        order,
        done
    )
}
