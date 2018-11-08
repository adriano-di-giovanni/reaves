local function rollback(entityId, newValue, createdAt, lastValue, changeTracker, gateways)
    do
        if (changeTracker.entityValueMap == 1) then
            local gateway = gateways.entityValueMap
            local fn
            if (lastValue ~= nil) then
                fn =  function() return gateway:upsert(entityId, lastValue) end
            else
                fn = function() return gateway:delete(entityId) end
            end
            pcall(fn)
        end
    end

    do
        if (changeTracker.createdAtIndex == 1) then
            pcall(function() return gateways.createdAtIndex:delete(entityId, value, createdAt) end)
        end
    end

    do
        if (changeTracker.entityIdIndex == 1) then
            pcall(function() return gateways.entityIdIndex:delete(entityId, value, createdAt) end)
        end
    end

    do
        local numChanges = changeTracker.valueIndex
        local gateway = gateways.valueIndex
        if (numChanges > 1) then
            pcall(function() return gateway:delete(entityId, newValue, createdAt) end)
        end
        if (numChanges > 0) then
            pcall(function() return gateway:delete(entityId, lastValue, createdAt) end)
        end
    end
end

local function insert(
    keyPrefix, isCaseSensitive, isUnique, memberSeparator, nullCharacter, entityId, newValue, createdAt)

    local NULL_ENTITY_ID = nullCharacter
    local NULL_VALUE = nullCharacter

    local gateways = {}
    local changeTracker = {}

    local lastCreatedAt
    local lastValue
    local lastEntityId

    local function preparedRollback()
        rollback(entityId, newValue, createdAt, lastValue, changeTracker, gateways)
    end

    -- get the most recent value and its timestamp for the entity with the given ID
    do
        local entityIdIndex = EntityIdIndex:create(keyPrefix, memberSeparator)

        local fn = function()
            return entityIdIndex:getMostRecent(entityId)
        end
        local success, v0, v1, v2 = pcall(fn)

        if (not success) then
            return redis.error_reply(v0)
        end

        lastCreatedAt = v2
        lastValue = v1

        gateways.entityIdIndex = entityIdIndex
    end

    -- do not accept past values
    if (lastCreatedAt ~= nil and createdAt < lastCreatedAt) then
        return redis.error_reply('Invalid timestamp')
    end

    if (lastValue ~= nil) then
        if (isCaseSensitive) then
            if (newValue == lastValue) then
                return { entityId, lastValue, lastCreatedAt }
            end
        else
            if (string.lower(newValue) == string.lower(lastValue)) then
                return { entityId, lastValue, lastCreatedAt }
            end
        end
    end

    if (isUnique) then
        -- get the most recent entity ID and its timestamp for the given new value
        do
            local valueIndex = ValueIndex:create(keyPrefix, isCaseSensitive, memberSeparator)

            local fn = function()
                return valueIndex:getMostRecent(newValue)
            end
            local success, v0, v1, v2 = pcall(fn)

            if (not success) then
                return redis.error_reply(v0)
            end

            lastEntityId = v0

            if (lastEntityId == entityId) then
                local value = v1
                local createdAt = v2
                return { entityId, value, createdAt }
            end

            gateways.valueIndex = valueIndex
        end

        -- do not accept duplicate values but nulls
        if (newValue ~= NULL_VALUE and lastEntityId ~= nil and lastEntityId ~= NULL_ENTITY_ID) then
            return redis.error_reply('Duplicate value')
        end
    end

    -- the entity with the given ID "loses" its last value
    if (lastValue ~= nil) then
        local valueIndex = gateways.valueIndex or
            ValueIndex:create(keyPrefix, isCaseSensitive, memberSeparator)

        local fn = function()
            return valueIndex:insert(NULL_ENTITY_ID, lastValue, createdAt)
        end
        local success, v0 = pcall(fn)

        if (not success) then
            return redis.error_reply(v0)
        end

        gateways.valueIndex = valueIndex
        changeTracker.valueIndex = 1
    end

    -- update the index
    do
        local valueIndex = gateways.valueIndex or
            ValueIndex:create(keyPrefix, isCaseSensitive, memberSeparator)

        local fn = function()
            return valueIndex:insert(entityId, newValue, createdAt)
        end
        local success, v0 = pcall(fn)

        if (not success) then
            preparedRollback()
            return redis.error_reply(v0)
        end

        changeTracker.valueIndex = 2
    end

    -- update the index
    do
        local entityIdIndex = gateways.entityIdIndex

        local fn = function()
            return entityIdIndex:insert(entityId, newValue, createdAt)
        end
        local success, v0 = pcall(fn)

        if (not success) then
            preparedRollback()
            return redis.error_reply(v0)
        end

        changeTracker.entityIdIndex = 1
    end

    -- update the index
    do
        local createdAtIndex = CreatedAtIndex:create(keyPrefix, memberSeparator)

        local fn = function()
            return createdAtIndex:insert(entityId, newValue, createdAt)
        end
        local success, v0 = pcall(fn)

        if (not success) then
            preparedRollback()
            return redis.error_reply(v0)
        end

        gateways.createdAtIndex = createdAtIndex
        changeTracker.createdAtIndex = 1
    end

    -- update the map
    do
        local entityValueMap = EntityValueMap:create(keyPrefix, memberSeparator)

        local fn = function()
            return entityValueMap:upsert(entityId, newValue)
        end
        local success, v0 = pcall(fn)

        if (not success) then
            preparedRollback()
            return redis.error_reply(v0)
        end

        gateways.entityValueMap = entityValueMap
        changeTracker.entityValueMap = 1
    end

    return { entityId, newValue, createdAt }
end

---

local keyPrefix = ARGV[1]
local isCaseSensitive = ARGV[2] == 'true'
local isUnique = ARGV[3] == 'true'
local memberSeparator = ARGV[4]
local nullCharacter = ARGV[5]
local entityId = ARGV[6]
local newValue = ARGV[7]
local createdAt = tonumber(ARGV[8], 10)

return insert(
    keyPrefix, isCaseSensitive, isUnique, memberSeparator, nullCharacter, entityId, newValue, createdAt)
