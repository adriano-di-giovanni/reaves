const { CASE_SENSITIVE, NULLABLE, UNIQUE } = require('./constants')
const v = require('./validate')

function EntityAttribute(client, entityName, attributeName, flags) {
    if (!v.client(client, "argument 1, 'client'")) {
        throw v.lastError
    }

    if (!v.entityName(entityName, "argument 2, 'entityName'")) {
        throw v.lastError
    }

    if (!v.attributeName(attributeName, "argument 3, 'attributeName'")) {
        throw v.lastError
    }

    if (!v.flags(flags, "argument 4, 'flags'")) {
        throw v.lastError
    }

    this._client = client
    this._keyPrefix = `${entityName}:${attributeName}`

    this._flags = flags
    this._isCaseSensitive = !!(flags & CASE_SENSITIVE)
    this._isNullable = !!(flags & NULLABLE)
    this._isUnique = !!(flags & UNIQUE)
}

EntityAttribute.prototype.isCaseSensitive = function() {
    return this._isCaseSensitive
}

EntityAttribute.prototype.isNullable = function() {
    return this._isNullable
}

EntityAttribute.prototype.isUnique = function() {
    return this._isUnique
}

EntityAttribute.prototype.getByEntityId = require('./getByEntityId')
EntityAttribute.prototype.getByValue = require('./getByValue')
EntityAttribute.prototype.getEntityId = require('./getEntityId')
EntityAttribute.prototype.getValue = require('./getValue')
EntityAttribute.prototype.insert = require('./insert')
EntityAttribute.prototype.searchByValue = require('./searchByValue')
EntityAttribute.prototype.searchByValueIgnoreCase = require('./searchByValueIgnoreCase')
EntityAttribute.prototype.verifyCompliance = require('./verifyCompliance')

EntityAttribute.CASE_SENSITIVE = CASE_SENSITIVE
EntityAttribute.NULLABLE = NULLABLE
EntityAttribute.UNIQUE = UNIQUE

/**
 * @classdesc Represents the entity attribute.
 * @class EntityAttribute
 * @hideconstructor
 */
module.exports = EntityAttribute
