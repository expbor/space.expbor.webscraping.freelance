import puppeteer from "puppeteer";
import fs from 'fs';

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

const startUrl = process.env.STARTURL;

if (startUrl == '') {
    console.log('Starturl missing');
};

const getQuotes = async () => {
    var quotes = [];

    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome-stable',
        headless: true,
        defaultViewport: null,
    });

    // Open a new page
    var page = await browser.newPage();

    await page.goto(startUrl, {
        waitUntil: "domcontentloaded",
    });

    await page.waitForSelector('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection');
    const acceptCookies = await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection');
    await acceptCookies.click();

    const arrayPages = await page.evaluate(() => Array.from(document.querySelectorAll('.nav-pagination-link'), element => element.innerText));
    const lastPage = arrayPages[arrayPages.length - 2];

    try {
        do {
            const currentPage = await page.evaluate(() => Array.from(document.querySelectorAll('.nav-pagination-item.active > .nav-pagination-link'), element => element.innerText));

            console.log("Seite " + currentPage + " von " + lastPage);


            const quotesSite = await page.evaluate(() => Array.from(document.querySelectorAll('.panel-body.single-profile.clearfix'), element => element.innerText));
            quotes = quotes.concat(quotesSite);

            const nextAvailable = await page.locator('.pagination > li:last-child > a');
            await nextAvailable.click();
            await page.waitForNavigation();
        } while (true);

    } catch (error) {
        if (error.message != "Timed out after waiting 30000ms"){
            console.log(error);
        }
    };

    // // Close the browser
    await browser.close();

    return (quotes);

};


// Start the scraping

var elements = await getQuotes();

var elementsObject = { elements };

var elementsString = JSON.stringify(elementsObject);

fs.writeFile('/usr/src/app/Data.json', elementsString, err => {
    if (err) {
        console.error(err);
    } else {
        console.log("Datei erfolgreich geschrieben");
    }
});



