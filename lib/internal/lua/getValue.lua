local function getValue(keyPrefix, entityId)
    local gateway = EntityValueMap:create(keyPrefix)
    local fn = function () return gateway:get(entityId) end
    local success, v0 = pcall(fn)

    if (not success) then
        return redis.error_reply(v0)
    end

    -- NOTE: Redis Nil bulk reply and Nil multi bulk reply -> Lua false boolean type
    -- https://redis.io/commands/eval#conversion-between-lua-and-redis-data-types
    local value = v0 or nil

    return value
end

---

local keyPrefix = ARGV[1]
local entityId = ARGV[2]

return getValue(keyPrefix, entityId)
