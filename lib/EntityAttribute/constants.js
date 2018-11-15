const isTesting = require('./isTesting')

let memberSeparator
let nullCharacter

if (!isTesting) {
    memberSeparator = '\x1f' // US
    nullCharacter = '\x03' // ETX
} else {
    memberSeparator = ':'
    nullCharacter = '_'
}

exports.MEMBER_SEPARATOR = memberSeparator
exports.NULL_CHARACTER = nullCharacter

exports.CASE_SENSITIVE = 0b001
exports.NULLABLE = 0b010
exports.UNIQUE = 0b100

exports.ASCENDING = 'ascending'
exports.DESCENDING = 'descending'
