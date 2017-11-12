const isBefore = require('date-fns/is_before')
const isSameDay = require('date-fns/is_same_day')

const isOfType = (asset, txn) => txn.get('buyAsset') === asset;
const isBeforeDate = (date, txn) => isSameDay(txn.get('date'), date) || isBefore(txn.get('date'), date)

module.exports = {
  isOfType,
  isBeforeDate
}
