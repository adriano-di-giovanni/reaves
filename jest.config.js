const ENTITY_NAME = 'entity'
const ATTRIBUTE_NAME = 'attribute'
const FLAGS = 0
module.exports = {
    globals: {
        ENTITY_NAME,
        ATTRIBUTE_NAME,
        FLAGS,
        KEY_PREFIX: `${ENTITY_NAME}:${ATTRIBUTE_NAME}`,
        MEMBER_SEPARATOR: '\x1f',
        NULL_CHARACTER: '\x03',
    },
    testPathIgnorePatterns: ['__tests__/support'],
}
