module.exports = (client, run, num) => {
  const stub = 'We are very grateful to the volunteers who made this event happen:';
  const url = `http://www.parkrun.org.uk/${run}/results/weeklyresults/?runSeqNumber=${num}`;
  return client
    .url(url)
    .elements(`p*=${stub}`).getText()
    .then(txt => {
      return txt.replace(stub, '').split(',').map(s => s.trim());
    });
}