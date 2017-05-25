const entries  = function *(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

module.exports = {
  entries
};
