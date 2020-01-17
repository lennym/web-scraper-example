const Promise = require('bluebird');
const browser = require('./browser');

module.exports = (runner) => {

  const url = `http://www.parkrun.org.uk/results/athleteresultshistory/?athleteNumber=${runner}`;
  const client = browser().init();
  return client
    .url(url)
    .elements('#content table')
    .then(tables => {
      const summary = tables.value[2];
      return client.elementIdElements(summary.ELEMENT, 'td:nth-child(3')
        .then(counts => {
          return Promise.reduce(counts.value, (count, elem) => {
            return client.elementIdText(elem.ELEMENT)
              .then(n => {
                return parseInt(n.value, 10)
              })
              .then(n => count + n);
          }, 0);
        });
    })
    .then(count => {
      client.end();
      return count;
    })
    .catch(e => {
      client.end();
      throw e;
    });

}