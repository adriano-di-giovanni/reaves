# reaves

Reaves is a Javascript implementation of the
[Entity-Attribute-Value model](https://en.wikipedia.org/wiki/Entity%E2%80%93attribute%E2%80%93value_model) and
the [event sourcing pattern](https://martinfowler.com/eaaDev/EventSourcing.html) for Node.js.

Simply put, it lets you save and retrieve present and past string values of attributes that
belong to entities identified by string IDs. Reaves is backed by [Redis](https://redis.io).

Please, refer to the [Installation](#installation), [Usage](#usage), [API](#api),
[Requirements](#requirements) and [License](#license) sections for more information.

## Installation <a name="installation"></a>

```bash
npm install reaves
```

## Usage <a name="usage"></a>

```javascript
const { createEntityAttribute, CASE_SENSITIVE, UNIQUE } = require('reaves')
const { generate } = require('randomstring')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const client = redis.createClient()
const entityName = 'player'
const entityName = 'nickname'
const flags = CASE_SENSITIVE | UNIQUE

createEntityAttribute(client, entityName, attributeName, flags, (err, entityAttribute) => {
    if (err) {
        throw err
    }

    const entityId = uuidv4()
    const newValue = generate()
    const createdAt = Date.now()
    entityAttribute.insert(entityId, newValue, createdAt, (err, event) => {
        if (err) {
            throw err
        }

        console.log(event)

        /*
        Event {
              entityId: '5eb92392-1d77-4183-858c-7d40a481b914',
              value: 'tGxRYYSDxWnbsXSTHcfqXG129IrIjjfd',
              createdAt: 1541774323588 }    
        */
    })
})``
```

## API

Please, refer to the API documentation [here](https://adriano-di-giovanni.github.io/reaves).

## Requirements <a name="requirements"></a>

* Node.js 6+
* Redis 2.8.9+

## License <a name="license"></a>

This project is [MIT-licensed](LICENSE)
