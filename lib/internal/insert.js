const createEvent = require('./createEvent')
const getLoader = require('./getLoader')

module.exports = (
    client,
    keyPrefix,
    isCaseSensitive,
    isUnique,
    memberSeparator,
    nullCharacter,
    entityId,
    aNewValue,
    createdAt,
    done
) => {
    getLoader(client).load('insert', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        const newValue = aNewValue || nullCharacter

        client.evalsha(
            sha,
            0,
            keyPrefix,
            isCaseSensitive,
            isUnique,
            memberSeparator,
            nullCharacter,
            entityId,
            newValue,
            createdAt,
            (err, reply) => {
                if (err) {
                    done(err)
                    return
                }

                const [entityId, value, createdAt] = reply

                done(null, createEvent(nullCharacter, entityId, value, createdAt))
            }
        )
    })
}
