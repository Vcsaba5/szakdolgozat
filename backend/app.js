const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const backendRoutes = require('./routes/routes.js');
const fs = require('fs');
const session = require('express-session');

const connection = require("./middleware/database.js");

const frontendPath = path.join(__dirname, '..', 'frontend');
const imagePath = path.join(__dirname, 'images');

const port = 3000;
const host = 'localhost';






app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'mySecretKey',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    expires: 24 * 60 * 60 * 1000, // 24 hours
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // secure: true csak HTTPS alatt működik
}));



app.get('/kosar', (req, res) => {
    fs.readFile('../frontend/html/cart/cart.html', (err, file) => {
        res.setHeader('content-type', 'text/html');
        res.end(file);
    });
})
app.get('/cart.js', (req, res) => {
    fs.readFile('../frontend/html/cart/cart.js', (err, file) => {
        res.end(file);
    });
})
app.get('/cart.css', (req, res) => {
    fs.readFile('../frontend/html/cart/cart.css', (err, file) => {
        res.end(file);
    });
})


app.get('/get-product-in-cart', (req, res) => {
    if (!req.session.products) {
        req.session.products = [];
    }

    let produactId = [];
    console.table(req.session.products);
    req.session.products.forEach(id => {
        produactId.push(id.id);
    });

    if (req.session.products.length != 0) {
        const sql = `SELECT * FROM termekek WHERE termekID IN (${produactId.join(',')})`;

        connection.query(sql, (error, results, fields) => {
            if (error) {
                throw error;
            }

            const productsWithQuantity = results.map(product => {
                const productInSession = req.session.products.find(item => item.termekID === product.id);
                const quantity = productInSession ? productInSession.quantity : 0;
                return { ...product, quantity };
            });

            res.json(productsWithQuantity);
        
        });
    }
    else{
        res.status();
    }
    
})


app.post('/add-to-cart', (req, res) => {
    console.table(req.body);
    const {productId,darabszam} = req.body;


    if (!req.session.products) {
        req.session.products = [];
    }

    const productIndex = req.session.products.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        req.session.products[productIndex].quantity += parseInt(darabszam);
    } else {
        req.session.products.push({ id: productId, quantity: parseInt(darabszam) });
    }

    console.table(req.session.products);

    res.status(200).send('Termék azonosító hozzáadva a session-höz.');

});






// json parse-hoz (hogy a req.body-ban érkező adatokat fel tudjuk dolgozni)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parse-hoz
app.use(cookieParser());

// backend útvonalak használatához
app.use('/', backendRoutes);

// frontend útvonalak használatához
app.use('/frontend', express.static(frontendPath));

// statikus fájlok kiszolgálása az 'images' mappából
app.use('/images', express.static(imagePath));

app.listen(port, host, () => {
    console.log(`IP: http://${host}:${port}`);
});