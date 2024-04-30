const { Builder, Browser, By, Key, until, logging } = require('selenium-webdriver');

async function runTest() {
    // a chrome elindítása
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // a webalkalmazás megnyitása
        await driver.get('http://localhost:3000');

        // a form kitöltése
        await driver.findElement(By.id('loginEmail')).sendKeys('admin@admin.hu');
        await driver.findElement(By.id('loginPassword')).sendKeys('123456aA', Key.RETURN); // a Key.RETURN meghívja a form submit eseményét, azaz a gombot, amivel be tudunk lépni az oldalra

/* Ez a rész csak Vandáéknak kell
        // Várunk, amíg az adott gomb meg nem jelenik (5 másodpercet várunk)
        await driver.wait(until.elementLocated(By.className('btn-success')), 5000);

        // Az adott gomb kiválasztása
        const successButton = await driver.findElement(By.className('btn-success'));

        // Kattintás erre a gombra
        await successButton.click();
// Idáig kell Vandáéknak a plusz felugró ablak miatt */

        // Várunk, amg az oldal átirányít
        await driver.wait(until.urlContains('/admin.html'), 10000);

        // Ellenőrzizzük le az oldal URL-jét, amire átirányított
        const currentURL = await driver.getCurrentUrl();

        // A teszt eredményét kiírjuk a konzolra
        // Ha ez a currentURL tartalmaza a /admin.html szövegrészt, akkor a teszt sikeresen lefutott, különben pedig a teszt hibára futott
        if (currentURL.includes('/admin.html')) {
            console.log('A teszt sikeresen lefutott, beléptünk az /admin.html oldalra');
        } else {
            console.log('A teszt sikeretelen, nem sikerült belépni az /admin.html oldalra');
        }
    } catch (error) {
        console.log(error);
    } finally {
        await driver.quit();
    }
}

runTest();