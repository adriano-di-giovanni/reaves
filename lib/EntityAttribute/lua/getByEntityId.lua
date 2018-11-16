local function getByEntityId(keyPrefix, memberSeparator, entityId, order)
    local gateway = EntityIdIndex:create(keyPrefix, memberSeparator, entityId)
    local isTerm = true
    local fn = function() return gateway:searchRaw(entityId, isTerm, order) end
    local success, data = pcall(fn)

    if (not success) then
        return redis.error_reply(data)
    end

    return data
end

---

local keyPrefix = ARGV[1]
local memberSeparator = ARGV[2]
local entityId = ARGV[3]
local order = ARGV[4]

return getByEntityId(keyPrefix, memberSeparator, entityId, order)
