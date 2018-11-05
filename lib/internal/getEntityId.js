const getLoader = require('./getLoader')

module.exports = (client, keyPrefix, isCaseSensitive, memberSeparator, value, done) => {
    getLoader(client).load('getEntityId', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        client.evalsha(sha, 0, keyPrefix, isCaseSensitive, memberSeparator, value, done)
    })
}
