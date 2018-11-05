const { getValue } = require('../internal')
const { NULL_CHARACTER } = require('./constants')
const v = require('./validate')

module.exports = function EntityAttribute$getValue(entityId, done) {
    if (!v.callback(done, "argument 2, 'done'")) {
        throw v.lastError
    }

    if (!v.entityId(entityId, "argument 1, 'entityId'")) {
        done(v.lastError)
        return
    }

    getValue(this._client, this._keyPrefix, NULL_CHARACTER, entityId, done)
}
