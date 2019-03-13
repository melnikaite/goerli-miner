exports.handler = (req, res) => {
  const puppeteer = require("puppeteer-extra");

  const pluginStealth = require("puppeteer-extra-plugin-stealth")
  puppeteer.use(pluginStealth());

  const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
  puppeteer.use(
    RecaptchaPlugin({
      provider: { id: '2captcha', token: '' },
      visualFeedback: true
    })
  );

  puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(async browser => {
    const page = await browser.newPage();
    console.log('Browser is opened');

    await page.goto('https://goerli-faucet.slock.it/');
    console.log('Page is opened');

    await page.type('#receiver', '');
    console.log('Address is entered');

    await page.solveRecaptchas();
    console.log('Captcha is solved');

    await Promise.all([
      page.waitForNavigation(),
      page.click(`#requestTokens`)
    ]);
    console.log('Request is sent');

    await browser.close();
    console.log('Browser is closed');

    res.status(200).send('success');
  });
};
