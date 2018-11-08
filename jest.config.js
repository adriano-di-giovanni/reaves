const ENTITY_NAME = 'entity'
const ATTRIBUTE_NAME = 'attribute'

module.exports = {
    globals: {
        ENTITY_NAME,
        ATTRIBUTE_NAME,
        FLAGS: 0,
        KEY_PREFIX: `${ENTITY_NAME}:${ATTRIBUTE_NAME}`,
        MEMBER_SEPARATOR: '\x1f',
        NULL_CHARACTER: '\x03',
    },
    testPathIgnorePatterns: ['__old_tests__', '__tests__/support'],
}
