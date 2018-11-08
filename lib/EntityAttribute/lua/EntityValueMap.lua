local EntityValueMap = {}
EntityValueMap.__index = EntityValueMap

function EntityValueMap:create(keyPrefix)
    local instance = {
        key = keyPrefix .. ':EntityValueMap'
    }
    setmetatable(instance, EntityValueMap)
    return instance
end

function EntityValueMap:get(entityId)
    return redis.call('HGET', self.key, entityId)
end

function EntityValueMap:delete(entityId)
    return redis.call('HDEL', self.key, entityId)
end

function EntityValueMap:upsert(entityId, newValue)
    return redis.call('HSET', self.key, entityId, newValue)
end
