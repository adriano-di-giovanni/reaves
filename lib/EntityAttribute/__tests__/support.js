const EntityAttribute = require('../')

const { ENTITY_NAME, ATTRIBUTE_NAME, FLAGS } = global

exports.createEntityAttribute = (client, flags = FLAGS) =>
    new EntityAttribute(client, ENTITY_NAME, ATTRIBUTE_NAME, flags)

exports.CASE_SENSITIVE = EntityAttribute.CASE_SENSITIVE
exports.NULLABLE = EntityAttribute.NULLABLE
exports.UNIQUE = EntityAttribute.UNIQUE
