/**
 * @module reaves
 */

const EntityAttribute = require('./EntityAttribute')

/**
 * The asynchronous factory method.
 *
 * @param {Object} client The redis client.
 * @param {String} entityName The name for the entity. It is an arbitrary string value that is used
 * to namespace the underlying redis keys.
 * @param {String} attributeName The name for the attribute. It is an arbitrary string value that is
 * used to namespace the underlying redis keys.
 * @param {Number} flags A flag or a combination of flags to configure the entity attribute.
 * The available flags are [CASE_SENSITIVE]{@link module:reaves.CASE_SENSITIVE},
 * [NULLABLE]{@link module:reaves.NULLABLE} and [UNIQUE]{@link module:reaves.UNIQUE}. They can be
 * combined using the `|` operator.
 * @param {Function} done The final callback. Invoked with `(err, entityAttribute)`.
 * @returns {EntityAttribute}
 *
 * @example
 * const { CASE_SENSITIVE, createdEntityAttribute, UNIQUE } = require('reaves')
 * const redis = require('redis')
 * const uuidv4 = require('uuid/v4')
 *
 * const client = redis.createClient()
 * const entityName = 'player'
 * const attributeName = 'nickname'
 * const flags = CASE_SENSITIVE | UNIQUE
 *
 * createEntityAttribute(client, entityName, attributeName, flags, (err, entityAttribute) => {
 *     // your code here
 * })
 */
exports.createEntityAttribute = (client, entityName, attributeName, flags, done) => {
    const entityAttribute = new EntityAttribute(client, entityName, attributeName, flags)
    entityAttribute.verifyCompliance((err, isCompliant) => {
        if (err) {
            done(err)
            return
        }

        if (!isCompliant) {
            done(new Error('Not compliant'))
            return
        }

        done(null, entityAttribute)
    })
}

/**
 * A flag that indicates whether the value comparisons should be case sensitive.
 *
 * @constant
 * @type {Number}
 * @default 0b001
 *
 */
exports.CASE_SENSITIVE = EntityAttribute.CASE_SENSITIVE

/**
 * A flag that indicates whether the attribute is nullable.
 *
 * @constant
 * @type {Number}
 * @default 0b010
 */
exports.NULLABLE = EntityAttribute.NULLABLE

/**
 * A flag that indicates whether the value should be unique.
 *
 * @constant
 * @type {Number}
 * @default 0b100
 */
exports.UNIQUE = EntityAttribute.UNIQUE
