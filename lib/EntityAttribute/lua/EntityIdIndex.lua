local EntityIdIndex = {}
EntityIdIndex.__index = EntityIdIndex

function EntityIdIndex:create(keyPrefix, memberSeparator)
    local instance = {
        key = keyPrefix .. ':EntityIdIndex',
        memberSeparator = memberSeparator
    }
    setmetatable(instance, EntityIdIndex)
    return instance
end

function EntityIdIndex:buildMember(entityId, value, createdAt)
    local memberSeparator = self.memberSeparator
    return createdAt .. memberSeparator .. entityId .. memberSeparator .. value
end

function EntityIdIndex:delete(entityId, value, createdAt)
    local member = self:buildMember(entityId, createdAt, value)
    return redis.call('ZREM', self.key, member)
end

function EntityIdIndex:getMostRecent(aEntityId, from, to)
    local query = aEntityId
    local isTerm = true
    local order = ORDER_DESCENDING
    local offset = 0
    local count = 1
    local reply = self:searchRaw(query, isTerm, from, to, order, offset, count)
    local member = reply[1]
    local entityId = nil
    local value = nil
    local createdAt = nil

    if (member ~= nil) then
        entityId, value, createdAt = self:unbuildMember(member)
    end

    return entityId, value, createdAt
end

function EntityIdIndex:searchRaw(aQuery, isTerm, from, to, order, offset, count)
    local query = aQuery
    local memberSeparator = self.memberSeparator

    if (isTerm) then
        query = query .. memberSeparator
    end

    local command
    local min
    local max
    if (order == ORDER_ASCENDING) then
        command = 'ZRANGEBYLEX'
        min = '[' .. from .. memberSeparator .. query
        max = '[' .. to .. memberSeparator .. query .. TRAILING_BYTE
    else
        command = 'ZREVRANGEBYLEX'
        min = '[' .. to .. memberSeparator .. query .. TRAILING_BYTE
        max = '[' .. from .. memberSeparator .. query
    end

    if (offset ~= nil and count ~= nil) then
        return redis.call(command, self.key, min, max, 'LIMIT', offset, count)
    end

    return redis.call(command, self.key, min, max)
end

function EntityIdIndex:insert(entityId, value, createdAt)
    local score = 0
    local member = self:buildMember(entityId, value, createdAt)
    return redis.call('ZADD', self.key, score, member)
end

function EntityIdIndex:unbuildMember(member)
    local memberSeparator = self.memberSeparator
    local pattern = '^(%d+)' .. memberSeparator .. '(.+)' .. memberSeparator .. '(.+)$'
    local createdAt, entityId, value = string.match(member, pattern)
    return entityId, value, tonumber(createdAt, 10)
end
