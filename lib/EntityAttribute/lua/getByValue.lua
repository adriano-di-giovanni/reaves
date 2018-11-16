local function getByValue(keyPrefix, isCaseSensitive, memberSeparator, value, order)
    local gateway
    if (isCaseSensitive) then
        gateway = CaseSensitiveValueIndex:create(keyPrefix, memberSeparator)
    else
        gateway = CaseInsensitiveValueIndex:create(keyPrefix, memberSeparator)
    end

    local isTerm = true
    local fn = function() return gateway:searchRaw(value, isTerm, order) end
    local success, data = pcall(fn)

    if (not success) then
        return redis.error_reply(data)
    end

    return data
end

local keyPrefix = ARGV[1]
local isCaseSensitive = ARGV[2] == 'true'
local memberSeparator = ARGV[3]
local value = ARGV[4]
local order = ARGV[5]

return getByValue(keyPrefix, isCaseSensitive, memberSeparator, value, order)
