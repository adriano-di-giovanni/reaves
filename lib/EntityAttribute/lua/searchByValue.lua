-- TODO: searchByValue and getByValue could be refactored to a version of searchByValue that
-- exposes the query type (prefix vs term)
local function searchByValue(keyPrefix, isCaseSensitive, memberSeparator, value, order)
    local gateway
    if (isCaseSensitive) then
        gateway = CaseSensitiveValueIndex:create(keyPrefix, memberSeparator)
    else
        gateway = CaseInsensitiveValueIndex:create(keyPrefix, memberSeparator)
    end

    local isTerm = false
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

return searchByValue(keyPrefix, isCaseSensitive, memberSeparator, value, order)
