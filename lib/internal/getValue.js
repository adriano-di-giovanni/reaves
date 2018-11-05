const getLoader = require('./getLoader')

module.exports = (client, keyPrefix, nullCharacter, entityId, done) => {
    getLoader(client).load('getValue', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        client.evalsha(sha, 0, keyPrefix, entityId, (err, value) => {
            if (err) {
                done(err)
                return
            }

            done(null, value !== nullCharacter ? value : null)
        })
    })
}
