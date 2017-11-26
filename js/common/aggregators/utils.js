const isBefore = require('date-fns/is_before')
const isSameDay = require('date-fns/is_same_day')
const {partial, every} = require('../core/fn')

const isOfType = (asset, txn) => txn.get('buyAsset') === asset || txn.get('sellAsset') === asset;
const isBeforeDate = (date, txn) => isSameDay(txn.get('date'), date) || isBefore(txn.get('date'), date);
const getTxnsOnDate = (txns, asset, day) => txns.filter(
  every(
    partial(isBeforeDate, day),
    partial(isOfType, asset)
  )
);

const calculatePercentageChange = (initial, current) => initial === 0
  ? 0
  : (current / initial) * 100;

const excludeFiat = data => data.filter((_, asset) => !['GBP', 'USD', 'EUR'].includes(asset));

module.exports = {
  getTxnsOnDate,
  calculatePercentageChange,
  excludeFiat
}
