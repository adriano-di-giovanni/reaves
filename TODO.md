Replace the three sorted sets of version 0.1.0 with three new ones having members

* created_at:entity_id:value
* created_at:value:entity_id
* created_at:lowercase_value:entity_id:value

when searching for events by value

* I query the created_at:value:entity_id sorted set when the entity attribute is case-sensitive or when I want to perform a case-sensitive search;
* I query the created_at:lowercase_value:entity_id:value when the entity attribute is case-insensitive or when I want to perform a case-insensitive search.

when searching for events by entity_id

* I query the created_at:entity_id:value sorted set

Remember to review the keywords in package.json
Remember to fix husky
Remember to introduce CREATED_AT_OFFSET as the only offset you apply to input createdAt to shift range from -50000/+50000 days to 0/+100000 days.
Add package version to verifyCompliance
Add default createdAt
Add default from
Add default to
change order param to flags in order to specify both order and case-sensitivity of the search
