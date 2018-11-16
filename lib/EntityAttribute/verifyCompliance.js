const packageVersion = require('../../package.json').version

module.exports = function EntityAttribute$verifyCompliance(done) {
    const client = this._client
    const keyPrefix = this._keyPrefix

    client.type(keyPrefix, (err, reply) => {
        if (err) {
            done(err)
            return
        }

        if (reply === 'none') {
            client.hmset(keyPrefix, { flags: this._flags, version: packageVersion }, err => {
                if (err) {
                    done(err)
                    return
                }

                done(null, true)
            })
            return
        }

        // NOTE: version 0.1.0 used a key of type string
        if (reply !== 'hash') {
            done(null, false)
            return
        }

        client.hgetall(keyPrefix, (err, reply) => {
            if (err) {
                done(err)
                return
            }

            done(null, +reply.flags === this._flags && reply.version === packageVersion)
        })
    })
}
