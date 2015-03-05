module.exports = function (apiKey) {
  var Closeio = require('close.io')
  var closeio = new Closeio(apiKey)
  var debug = require('debug')('metrics:closeio')

  return function (metrics) {
    var createdLastWeek = 'date_created < "1 week ago"'
    var createdTwoWeeksAgo =
      'date_created < "2 weeks ago" and date_created >= "1 week ago"'
    var activeStatus = 'status_type: active'

    query('closeio leads created last week',
      '/lead/',
      createdLastWeek,
      'total_results'
    )

    query('closeio leads created 2 weeks ago',
      '/lead/',
      createdTwoWeeksAgo,
      'total_results'
    )

    query('closeio opportunities created last week',
      '/opportunity/',
      createdLastWeek,
      'total_results'
    )

    query('closeio opportunities created 2 weeks ago',
      '/opportunity/',
      createdTwoWeeksAgo,
      'total_results'
    )

    query('closeio active opportunities total value',
      '/opportunity/',
      activeStatus,
      'total_value_annualized'
    )

    query('closeio active opportunities expected value',
      '/opportunity/',
      activeStatus,
      'expected_value_annualized'
    )

    setValueOfWonOpportunitiesThisMonthByUser()
  }

  function query(key, path, query, prop) {
    closeio._get(path, { _fields: '', query: query })
      .then(function (results) {
        metrics.set(key, results[prop])
      }, debugError)
  }

  function setValueOfWonOpportunitiesThisMonthByUser() {
    var date = new Date()
    date.setDate(1)
    var since = date.toISOString().split('T')[0]
    var users = {}

    aggregateWonOpportunityValues(0)
    metrics.set('closeio won opportunities value this month by user', users)

    function aggregateWonOpportunityValues(lastCount) {
      closeio
        ._get('/opportunity/', {
          _fields: 'user_id,user_name,value',
          _skip: lastCount,
          query: 'status_type: won and date >= ' + since
        })
        .then(function (results) {
          lastCount += results.data.length

          results.data.forEach(function (data) {
            var user = users[data.user_id] = users[data.user_id] || {
              name: data.user_name,
              value: 0
            }

            user.value += data.value
          })

          if (results.total_results > lastCount) {
            aggregateWonOpportunityValues(lastCount)
          }
        }, debugError)
    }
  }

  function debugError(error) {
    debug('Error: %s', error)
  }
}
