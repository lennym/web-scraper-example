const Promise = require('bluebird');
const browser = require('./browser');
const {Bar} = require('cli-progress');

module.exports = (run, runNumber) => {

  const bar = new Bar();
  const people = {};
  const url = `http://www.parkrun.org.uk/${run}/results/weeklyresults/?runSeqNumber=${runNumber}`;
  console.log(`Reading results for run #${runNumber}`);
  const client = browser().init();
  return client
    .url(url)
    .elements('tr')
    .then(list => {
      console.log(`Found ${list.value.length} runners`);
      bar.start(list.value.length, 0);
      return Promise.map(list.value, node => {
        let id;

        return client
          .elementIdElement(node.ELEMENT, 'td:nth-child(2) a')
          .then(link => {
            if (!link.value) {
              bar.increment();
              throw new Error('Unknown');
            }
            return client.elementIdAttribute(link.value.ELEMENT, 'href')
              .then(url => {
                id = url.value.match(/athleteNumber=([0-9]+)/)[1];
              })
              .then(() => client.elementIdText(link.value.ELEMENT))
              .then(name => {
                people[id] = { name: name.value, id };
              });
          })
          .then(() => client.elementIdElement(node.ELEMENT, 'td:nth-child(10)'))
          .then(cell => {
            return client
              .elementIdText(cell.value.ELEMENT)
                .then(result => result.value)
                .then(count => {
                  if (people[id]) {
                    people[id].count = parseInt(count, 10);
                  }
                });
          })
          .then(() => bar.increment())
          .catch(e => {
            if (e.message !== 'Unknown') {
              throw e;
            }
          });
      }, { concurrency: 5 });
    })
    .then(() => client.end())
    .then(() => bar.stop())
    .then(() => people)
    .catch(e => {
      client.end();
      throw e;
    });

}