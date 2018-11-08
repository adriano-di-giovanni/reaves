const path = require('path')
const luaload = require('luaload')

const instances = new WeakMap()

const SOURCE_DIRECTORY = path.join(__dirname, './lua')
const MAPPINGS = {
    getByEntityId: ['constants', 'EntityIdIndex', 'getByEntityId'],
    getByValue: ['constants', 'ValueIndex', 'getByValue'],
    getEntityId: ['constants', 'ValueIndex', 'getEntityId'],
    getValue: ['EntityValueMap', 'getValue'],
    insert: [
        'constants',
        'CreatedAtIndex',
        'EntityIdIndex',
        'EntityValueMap',
        'ValueIndex',
        'insert',
    ],
    searchByValue: ['constants', 'ValueIndex', 'searchByValue'],
}
const SHOULD_OUTPUT = /test/.test(process.env.NODE_ENV)

module.exports = client => {
    let instance = instances.get(client)
    if (instance == null) {
        instance = luaload(client, SOURCE_DIRECTORY, MAPPINGS, SHOULD_OUTPUT)
        instances.set(client, instance)
    }
    return instance
}
