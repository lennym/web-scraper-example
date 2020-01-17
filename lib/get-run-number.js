module.exports = (client, run) => {

  const url = `http://www.parkrun.org.uk/${run}/results/eventhistory/`;
  return client
    .url(url)
    .elements('#results tbody tr:first-child td:first-child').getText()
    .then(number => {
      return parseInt(number, 10);
    });

}