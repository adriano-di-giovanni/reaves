-- TODO: searchByValue and getByValue could be refactored to a version of searchByValue that
-- exposes the query type (prefix vs term)
local function searchByValue(keyPrefix, isCaseSensitive, memberSeparator, value, from, to, order)
    local gateway
    if (isCaseSensitive) then
        gateway = CaseSensitiveValueIndex:create(keyPrefix, memberSeparator)
    else
        gateway = CaseSensitiveValueIndex:create(keyPrefix, memberSeparator)
    end

    local isTerm = false
    local fn = function() return gateway:searchRaw(value, isTerm, from, to, order) end
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
local from = ARGV[5]
local to = ARGV[6]
local order = ARGV[7]

return searchByValue(keyPrefix, isCaseSensitive, memberSeparator, value, from, to, order)
