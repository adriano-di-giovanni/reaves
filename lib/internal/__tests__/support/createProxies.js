const getByEntityId = require('../../getByEntityId')
const getByValue = require('../../getByValue')
const getEntityId = require('../../getEntityId')
const getValue = require('../../getValue')
const insert = require('../../insert')
const searchByValue = require('../../searchByValue')

const { KEY_PREFIX, MEMBER_SEPARATOR, NULL_CHARACTER } = global

module.exports = (client, isCaseSensitive, isUnique) => {
    return {
        getByEntityId(entityId, order, done) {
            getByEntityId(
                client,
                KEY_PREFIX,
                MEMBER_SEPARATOR,
                NULL_CHARACTER,
                entityId,
                order,
                done
            )
        },
        getByValue(value, order, done) {
            getByValue(
                client,
                KEY_PREFIX,
                isCaseSensitive,
                MEMBER_SEPARATOR,
                NULL_CHARACTER,
                value,
                order,
                done
            )
        },
        getEntityId(value, done) {
            getEntityId(client, KEY_PREFIX, isCaseSensitive, MEMBER_SEPARATOR, value, done)
        },
        getValue(entityId, done) {
            getValue(client, KEY_PREFIX, NULL_CHARACTER, entityId, done)
        },
        insert(entityId, newValue, createdAt, done) {
            insert(
                client,
                KEY_PREFIX,
                isCaseSensitive,
                isUnique,
                MEMBER_SEPARATOR,
                NULL_CHARACTER,
                entityId,
                newValue,
                createdAt,
                done
            )
        },
        searchByValue(value, order, done) {
            searchByValue(
                client,
                KEY_PREFIX,
                isCaseSensitive,
                MEMBER_SEPARATOR,
                NULL_CHARACTER,
                value,
                order,
                done
            )
        },
    }
}
