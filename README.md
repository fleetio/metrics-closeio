# metrics-closeio

A [Close.io](http://close.io/) plugin for
[segmentio/metrics](https://github.com/segmentio/metrics).

## Installation

    $ npm install metrics-closeio

## Example

```js
var Metrics = require('metrics');
var closeio = require('metrics-closeio');

new Metrics()
  .every('30m', closeio('apiKey'));
```

## Metrics

The metrics exposed by this plugin are:

Number of leads created:
- `closeio leads created last week` - in the last week
- `closeio leads created 2 weeks ago` - in the week before the last

Number of opportunities created:
- `closeio opportunities created last week` - in the last week
- `closeio opportunities created 2 weeks ago` - in the week before the last

Active Opportunities:
- `closeio active opportunities total value` - annualized total value
- `closeio active opportunities expected value` - annualized expected value

By user:
- `closeio won opportunities value this month by user` - total value of won
  opportunities this month

```js
{
  "user_id_1": {
    name: "Bob",
    value: 42000
  },
  "user_id_2": {
    name: "Alice",
    value: 99000
  }
}
```
