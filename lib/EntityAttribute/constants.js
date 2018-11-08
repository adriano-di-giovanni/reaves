exports.MEMBER_SEPARATOR = '\x1f' // US
exports.NULL_CHARACTER = '\x03' // ETX

// NOTE: The `createdAt` range is -50,000 days to 50,000 days relative to January 1, 1970 UTC.
const MAX_CREATED_AT = 1000 * 60 * 60 * 24 * 50000
exports.MAX_CREATED_AT = MAX_CREATED_AT
exports.MIN_CREATED_AT = -MAX_CREATED_AT

// NOTE: both MAX_CREATED_AT and MIN_CREATED_AT have 13 digits: we need a 1 followed by 13 zeros to
// pad a createdAt
exports.CREATED_AT_PADDING = 1e13

exports.CASE_SENSITIVE = 0b001
exports.NULLABLE = 0b010
exports.UNIQUE = 0b100

exports.ASCENDING = 'ascending'
exports.DESCENDING = 'descending'
