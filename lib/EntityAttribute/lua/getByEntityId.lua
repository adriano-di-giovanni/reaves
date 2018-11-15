local function getByEntityId(keyPrefix, memberSeparator, entityId, from, to, order)
    local gateway = EntityIdIndex:create(keyPrefix, memberSeparator, entityId)
    local isTerm = true
    local fn = function() return gateway:searchRaw(entityId, isTerm, from, to, order) end
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
local from = ARGV[4]
local to = ARGV[5]
local order = ARGV[6]

return getByEntityId(keyPrefix, memberSeparator, entityId, from, to, order)
