local function getEntityId(keyPrefix, isCaseSensitive, memberSeparator, value)
    local gateway
    if (isCaseSensitive) then
        gateway = CaseSensitiveValueIndex:create(keyPrefix, memberSeparator)
    else
        gateway = CaseSensitiveValueIndex:create(keyPrefix, memberSeparator)
    end

    local fn = function () return gateway:getMostRecent(value) end
    local success, v0, v1, v2 = pcall(fn)

    if (not success) then
        return redis.error_reply(v0)
    end

    local entityId = v0

    return entityId
end

---

local keyPrefix = ARGV[1]
local isCaseSensitive = ARGV[2] == 'true'
local memberSeparator = ARGV[3]
local value = ARGV[4]

return getEntityId(keyPrefix, isCaseSensitive, memberSeparator, value)
