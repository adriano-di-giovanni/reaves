const MAX_VALUE = 1000 * 60 * 60 * 24 * 50000
const MIN_VALUE = -MAX_VALUE
const ABS_MIN_VALUE = Math.abs(MIN_VALUE)

// we need to transpose + pad the input `createdAt` to make the lexicographical order work as
// chronological without having to deal with strings.
const PADDING = Math.pow(10, Math.ceil(Math.log10(MAX_VALUE + ABS_MIN_VALUE)))
const OFFSET = ABS_MIN_VALUE + PADDING

const decode = aValue => {
    const value = +aValue
    return value - OFFSET
}

const encode = aValue => {
    const value = +aValue
    return value + OFFSET
}

const isInRange = aValue => {
    const value = +aValue
    return value >= MIN_VALUE && value <= MAX_VALUE
}

// The transposed + padded min and max values
exports.MIN_ENCODED_CREATED_AT = encode(MIN_VALUE)
exports.MAX_ENCODED_CREATED_AT = encode(MAX_VALUE)

exports.decode = decode
exports.encode = encode
exports.isInRange = isInRange
