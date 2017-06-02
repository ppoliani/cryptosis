const entries  = function *(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

const getPercentageChange = (initial, current) => initial
  ? (current - initial) / initial * 100
  : 0;

module.exports = {
  entries,
  getPercentageChange
};
