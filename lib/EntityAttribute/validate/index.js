function Validator() {
    this._lastError = null
}

Validator.prototype.attributeName = require('./attributeName')
Validator.prototype.callback = require('./callback')
Validator.prototype.client = require('./client')
Validator.prototype.createdAt = require('./createdAt')
Validator.prototype.entityId = require('./entityId')
Validator.prototype.entityName = require('./entityName')
Validator.prototype.flags = require('./flags')
Validator.prototype.order = require('./order')
Validator.prototype.value = require('./value')

Object.defineProperty(Validator.prototype, 'lastError', {
    get() {
        return this._lastError
    },
})

module.exports = new Validator()
