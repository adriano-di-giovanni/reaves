const createEvent = require('./createEvent')
const getLoader = require('./getLoader')

module.exports = (
    client,
    keyPrefix,
    isCaseSensitive,
    memberSeparator,
    nullCharacter,
    value,
    order,
    done
) => {
    getLoader(client).load('searchByValue', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        client.evalsha(
            sha,
            0,
            keyPrefix,
            isCaseSensitive,
            memberSeparator,
            value,
            order,
            (err, reply) => {
                if (err) {
                    done(err)
                    return
                }

                const transform = isCaseSensitive
                    ? r => {
                          const [value, createdAt, entityId] = r.split(memberSeparator)
                          return createEvent(nullCharacter, entityId, value, createdAt)
                      }
                    : r => {
                          const [createdAt, entityId, value] = r.split(memberSeparator).slice(1)
                          return createEvent(nullCharacter, entityId, value, createdAt)
                      }

                done(null, reply.map(transform))
            }
        )
    })
}
