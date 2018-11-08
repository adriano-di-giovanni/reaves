module.exports = function EntityAttribute$verifyCompliance(done) {
    this._client.get(this._keyPrefix, (err, reply) => {
        if (err) {
            done(err)
            return
        }

        if (reply !== null) {
            done(null, +reply === this._flags)
            return
        }

        this._client.set(this._keyPrefix, this._flags, err => {
            if (err) {
                done(err)
                return
            }

            done(null, true)
        })
    })
}
