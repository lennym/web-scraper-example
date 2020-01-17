const webdriverio = require('webdriverio');
const options = {
  desiredCapabilities: {
    browserName: 'chrome',
    chromeOptions: { args: ['headless', 'disable-gpu'] }
  }
};

module.exports = () => {
  return webdriverio.remote(options);
};
