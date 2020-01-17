const Promise = require('bluebird');
const browser = require('./browser');
const {Bar} = require('cli-progress');
const uniq = require('lodash.uniq');

module.exports = (run) => {

  const bar = new Bar();
  const url = `http://www.parkrun.org.uk/${run}/futureroster/`;
  const client = browser().init();
  return client
    .url(url)
    .elements('#viewroster tbody td')
    .then(list => {
      console.log(`Found ${list.value.length} volunteers`);
      bar.start(list.value.length, 0);
      return Promise.map(list.value, node => {
        let id;

        return client
          .elementIdText(node.ELEMENT, 'td:nth-child(2) a')
          .then(text => text.value)
          .then(text => {
            bar.increment();
            return text;
          });
      }, { concurrency: 1 });
    })
    .then(people => {
      client.end();
      bar.stop();
      return uniq(people.filter(Boolean));
    })
    .catch(e => {
      client.end();
      throw e;
    });

}