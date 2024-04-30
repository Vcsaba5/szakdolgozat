const { Builder, Browser, By, Key, until, logging } = require('selenium-webdriver');

async function runTest(driver, browserName) {
    try {
        // Nyisd be a weboldalt
        await driver.get('http://localhost:3000/');

        // Töltsd ki az űrlapot
        await driver.findElement(By.id('loginEmail')).sendKeys('admin@admin.hu');
        await driver.findElement(By.id('loginPassword')).sendKeys('123456aA', Key.RETURN); // a Key.RETURN meghívja a form submit eseményét, azaz a gombot, amivel be tudunk lépni az oldalra

/* 
        // Várunk, amíg az adott gomb meg nem jelenik (5 másodpercet várunk)
        await driver.wait(until.elementLocated(By.className('btn-success')), 5000);

        // Az adott gomb kiválasztása
        const successButton = await driver.findElement(By.className('btn-success'));

        // Kattintás erre a gombra
        await successButton.click();
//  */

        // Várunk, amg az oldal átirányít
        await driver.wait(until.urlContains('/admin.html'), 10000);

        // Ellenőrzizzük le az oldal URL-jét, amire átirányított
        const currentURL = await driver.getCurrentUrl();

        // A teszt eredményét kiírjuk a konzolra
        // Ha ez a currentURL tartalmaza a /admin.html szövegrészt, akkor a teszt sikeresen lefutott, különben pedig a teszt hibára futott
        if (currentURL.includes('/admin.html')) {
            console.log(`A teszt sikeresen lefutott a ${browserName} böngészőben, beléptünk az /admin.html oldalra`);
        } else {
            console.log(`A teszt sikeretelen, nem sikerült belépni az /admin.html oldalra a ${browserName} böngészőben`);
        }
    } catch (error) {
        // Ha valamelyik böngészőben nem futott le a teszt, akkor a hibát kírjuk, hogy melyik böngészőben nem sikerült a teszt.
        console.log(`Hiba történt a ${browserName} böngészőben: ${error}`);
    } finally {
        // Zárjuk be a megnyitott böngészőt
        await driver.quit();
    }
}

async function runTests() {
    // Az egyes böngészők megnyitása
    const chromeDriver = await new Builder().forBrowser('chrome').build();
    const firefoxDriver = await new Builder().forBrowser('firefox').build();
    const edgeDriver = await new Builder().forBrowser('MicrosoftEdge').build();
    /*
    const operaDriver = await new Builder().forBrowser('opera').build();
    const operaGXDriver = await new Builder().forBrowser('opera gx').build();
    const braveDriver = await new Builder().forBrowser('brave').build();
    */

    try {
        // Az összes böngészőben lévő teszt végrehajtása egymás után Promies.all segítségével
        await Promise.all([
            runTest(chromeDriver, 'Google Chrome'),
            runTest(firefoxDriver, 'Mozzila Firefox'),
            runTest(edgeDriver, 'Microsoft Edge')
        ]);
    } catch (error) {
        console.log(`Hiba történt a tesztek során: ${error}`);
    }
}

runTests();