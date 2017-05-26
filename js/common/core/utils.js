const entries  = function *(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

const getPercentageChange = (initial, current) => (current - initial) / initial * 100

module.exports = {
  entries,
  getPercentageChange
};
