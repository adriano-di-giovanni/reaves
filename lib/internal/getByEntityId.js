const createEvent = require('./createEvent')
const getLoader = require('./getLoader')

module.exports = (client, keyPrefix, memberSeparator, nullCharacter, entityId, order, done) => {
    getLoader(client).load('getByEntityId', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        client.evalsha(sha, 0, keyPrefix, memberSeparator, entityId, order, (err, reply) => {
            if (err) {
                done(err)
                return
            }

            const transform = r => {
                const [entityId, createdAt, value] = r.split(memberSeparator)
                return createEvent(nullCharacter, entityId, value, createdAt)
            }

            done(null, reply.map(transform))
        })
    })
}
