const args = require('minimist')(process.argv.slice(2));
const getRunNumber = require('./lib/get-run-number');
const getVolunteers = require('./lib/get-volunteers-for-run');
const getTopResults = require('./lib/get-top-results');
const browser = require('./lib/browser');

const terminalOverwrite = require('terminal-overwrite');

const run = args._[0] || 'finsbury';
const n = args.runs || 50;

const client = browser().init();
const trim = str => str.split('\n').map(s => s.trim()).join('\n')
const results = {};
console.log(`Searching last ${n} results for volunteers from: ${run}`);
terminalOverwrite.done();

getRunNumber(client, run)
  .then(start => {
    let num = start;
    let p = Promise.resolve();
    let count = 0;
    while (num > 0 && num > start - n) {
      const _num = num;
      p = p.then(() => {
        return getVolunteers(client, run, _num)
          .then(volunteers => {
            volunteers.forEach(name => results[name] = results[name] ? results[name] + 1 : 1);
            terminalOverwrite(
              trim(
                `${++count} runs scanned - last scanned: ${_num}.
                Found ${Object.keys(results).length} volunteers in total.
                Top volunteers:
                ${getTopResults(results, 20)}`
              )
            );
          });
      });
      num--;
    }
    return p;
  })
  .then(() => {
    client.end();
  })
  .catch(e => {
    client.end();
    console.error(e);
    process.exitCode = 1;
  });
