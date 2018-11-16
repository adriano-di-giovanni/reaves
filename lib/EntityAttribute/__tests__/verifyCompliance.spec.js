const async = require('async')
const redis = require('redis')
const { createEntityAttribute, CASE_SENSITIVE } = require('./support')

const client = redis.createClient()

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should not allow mismatching flags', done => {
    async.series(
        [
            callback => createEntityAttribute(client).verifyCompliance(callback),
            callback => createEntityAttribute(client, CASE_SENSITIVE).verifyCompliance(callback),
        ],
        (err, results) => {
            if (err) {
                done(err)
                return
            }

            expect(results).toEqual([true, false])
            done()
        }
    )
})
