const isTesting = require('./isTesting')

const path = require('path')
const luaload = require('luaload')

const instances = new WeakMap()

const SOURCE_DIRECTORY = path.join(__dirname, './lua')
const MAPPINGS = {
    getByEntityId: ['constants', 'EntityIdIndex', 'getByEntityId'],
    getByValue: ['constants', 'CaseInsensitiveValueIndex', 'CaseSensitiveValueIndex', 'getByValue'],
    getEntityId: [
        'constants',
        'CaseInsensitiveValueIndex',
        'CaseSensitiveValueIndex',
        'getEntityId',
    ],
    getValue: ['EntityValueMap', 'getValue'],
    insert: [
        'constants',
        'EntityIdIndex',
        'EntityValueMap',
        'CaseInsensitiveValueIndex',
        'CaseSensitiveValueIndex',
        'insert',
    ],
    searchByValue: [
        'constants',
        'CaseInsensitiveValueIndex',
        'CaseSensitiveValueIndex',
        'searchByValue',
    ],
}
const SHOULD_OUTPUT = isTesting()

module.exports = client => {
    let instance = instances.get(client)
    if (instance == null) {
        instance = luaload(client, SOURCE_DIRECTORY, MAPPINGS, SHOULD_OUTPUT)
        instances.set(client, instance)
    }
    return instance
}
