const { toPairs } = require('lodash');
const Table = require('cli-table');

module.exports = (set, num) => {
  const top = toPairs(set).sort((a, b) => b[1] - a[1]).slice(0, num).map((arr, i) => [i + 1].concat(arr));
  const table = new Table();
  table.push.apply(table, top);
  return table.toString();
};
