local CaseSensitiveValueIndex = {}
CaseSensitiveValueIndex.__index = CaseSensitiveValueIndex

function CaseSensitiveValueIndex:create(keyPrefix, memberSeparator)
    local instance = {
        key = keyPrefix .. ':CaseSensitiveValueIndex',
        memberSeparator = memberSeparator
    }
    setmetatable(instance, CaseSensitiveValueIndex)
    return instance
end

function CaseSensitiveValueIndex:buildMember(entityId, value, createdAt)
    local memberSeparator = self.memberSeparator
    return value .. memberSeparator .. createdAt .. memberSeparator .. entityId
end

function CaseSensitiveValueIndex:delete(entityId, value, createdAt)
    local member = self:buildMember(entityId, value, createdAt)
    return redis.call('ZREM', self.key, member)
end

function CaseSensitiveValueIndex:getMostRecent(value, from, to)
    local query = value
    local isTerm = true
    local order = ORDER_DESCENDING
    local offset = 0
    local count = 1
    local reply = self:searchRaw(query, isTerm, from, to, order, offset, count)
    local member = reply[1]
    local entityId = nil
    local createdAt = nil

    value = nil

    if (member ~= nil) then
        entityId, value, createdAt = self:unbuildMember(member)
    end

    return entityId, value, createdAt
end

function CaseSensitiveValueIndex:searchRaw(aQuery, isTerm, from, to, order, offset, count)
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
        min = '[' .. query
        max = '[' .. query .. TRAILING_BYTE
    else
        command = 'ZREVRANGEBYLEX'
        min = '[' .. query .. TRAILING_BYTE
        max = '[' .. query
    end

    if (offset ~= nil and count ~= nil) then
        return redis.call(command, self.key, min, max, 'LIMIT', offset, count)
    end

    return redis.call(command, self.key, min, max)
end

function CaseSensitiveValueIndex:insert(entityId, value, createdAt)
    local score = 0
    local member = self:buildMember(entityId, value, createdAt)
    return redis.call('ZADD', self.key, score, member)
end

function CaseSensitiveValueIndex:unbuildMember(member)
    local memberSeparator = self.memberSeparator

    local pattern
    local entityId
    local value
    local createdAt

    pattern = '^(.+)' .. memberSeparator .. '(%d+)' .. memberSeparator .. '(.+)$'
    value, createdAt, entityId = string.match(member, pattern)

    return entityId, value, tonumber(createdAt, 10)
end
