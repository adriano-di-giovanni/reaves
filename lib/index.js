const EntityAttribute = require('./EntityAttribute')

function reaves(client, entityName, attributeName, options) {
    return new EntityAttribute(client, entityName, attributeName, options)
}

reaves.CASE_SENSITIVE = EntityAttribute.CASE_SENSITIVE
reaves.NULLABLE = EntityAttribute.NULLABLE
reaves.UNIQUE = EntityAttribute.UNIQUE

module.exports = reaves
