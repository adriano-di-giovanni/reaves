local CreatedAtIndex = {}
CreatedAtIndex.__index = CreatedAtIndex

function CreatedAtIndex:create(keyPrefix, memberSeparator)
    local instance = {
        key = keyPrefix .. ':CreatedAtIndex',
        memberSeparator = memberSeparator
    }
    setmetatable(instance, CreatedAtIndex)
    return instance
end

function CreatedAtIndex:buildMember(entityId, value, createdAt)
    local memberSeparator = self.memberSeparator
    return createdAt .. memberSeparator .. entityId .. memberSeparator .. value
end

function CreatedAtIndex:delete(entityId, value, createdAt)
    local member = self:buildMember(entityId, value, createdAt)
    return redis.call('ZREM', self.key, member)
end

function CreatedAtIndex:searchRaw(aQuery, isTerm, order, offset, count)
    local query = aQuery

    if (isTerm) then
        query = query .. self.memberSeparator
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

function CreatedAtIndex:insert(entityId, value, createdAt)
    local score = 0
    local member = self:buildMember(entityId, value, createdAt)
    return redis.call('ZADD', self.key, score, member)
end
