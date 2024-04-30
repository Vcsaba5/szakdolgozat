const express = require("express");
const connection = require("../../middleware/database.js");
const upload = require("../../middleware/upload.js");
const router = express.Router();

// terkmekek lekérdezése route
router.get("/termek", function (req, res) {
  connection.query("SELECT * FROM airsoft", (err, result) => {
    res.json(result);
  });
});

// egy konkrét terkmek lekérdezése termekID alapján route
router.get("/termek/:id", function (req, res) {
  const id = req.params.id;

  connection.query(
    "SELECT * FROM termekek WHERE termekID=?",
    [id],
    (err, result) => {
      res.json(result);
    }
  );
});

// terkmekek lekérdezése userID alapján
router.get("/termekUser/:id", function (req, res) {
  const id = req.params.id;

  connection.query(
    "SELECT termekek.termekID, termekek.name, termekek.price, termekek.image, termekek.rating, COALESCE(r.rating, 0) AS userRating FROM termekek LEFT JOIN( SELECT termekID, rating FROM rating WHERE userID = 2) r USING(termekID);",
    [id],
    (err, result) => {
      res.json(result);
    }
  );
});

router.get("/Fegyver/:id", function (req, res) {
  const id = req.params.id;

  connection.query(
    "SELECT termekek.termekID, termekek.name, termekek.termektipus, termekek.price, termekek.image, termekek.rating, COALESCE(r.rating, 0) AS userRating FROM termekek LEFT JOIN( SELECT termekID, rating FROM rating WHERE userID = 2) r USING(termekID) WHERE termekek.termektipus = 'Fegyver';",
    [id],
    (err, result) => {
      res.json(result);
      /* console.log("Fegyverek...................... start");
        console.log(result);
        console.log("Fegyverek...................... end");
            */
    }
  );
});

router.get("/Felszereles/:id", function (req, res) {
  const id = req.params.id;

  connection.query(
    'SELECT termekek.termekID, termekek.name, termekek.price, termekek.image, termekek.rating, COALESCE(r.rating, 0) AS userRating FROM termekek LEFT JOIN( SELECT termekID, rating FROM rating WHERE userID = 2) r USING(termekID) WHERE termekek.termektipus = "Felszereles";',
    [id],
    (err, result) => {
      res.json(result);
    }
  );
});

router.get("/Karbantartas/:id", function (req, res) {
  const id = req.params.id;

  connection.query(
    'SELECT termekek.termekID, termekek.name, termekek.price, termekek.image, termekek.rating, COALESCE(r.rating, 0) AS userRating FROM termekek LEFT JOIN( SELECT termekID, rating FROM rating WHERE userID = 2) r USING(termekID) WHERE termekek.termektipus = "Karbantartas";',
    [id],
    (err, result) => {
      res.json(result);
    }
  );
});

// egy terkmekek lekérdezése mobilra email alapján
router.get("/termekekMobil/:termekID/:userID", function (req, res) {
  const termekID = req.params.termekID;
  const userID = req.params.userID;

  connection.query(
    "SELECT terkmekek.termekID, terkmekek.name, terkmekek.price, terkmekek.image, terkmekek.rating, COALESCE(r.rating, 0) AS userRating FROM terkmekek s LEFT JOIN (SELECT terkmekekID, rating FROM rating WHERE userID = ?) r USING (terkmekekkID) WHERE termekek.terkmekekID = ?;",
    [userID, termekID],
    (err, result) => {
      res.json(result);
    }
  );
});

// terkmekek létrehozása route
router.post("/termekek", upload.single("image"), function (req, res) {
  const { name, terkmekek } = req.body; // destruktálás = szétbontás
  const imageName = req.file ? req.file.filename : "no_image.png";

  connection.query(
    "INSERT INTO terkmekek(terkmekID, name, terkmektipus, image, price, rating) VALUES (NULL, ?, ?, ?, ?, 0)",
    [name, terkmekek, imageName],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.json("Sikeres felvétel!");
    }
  );
});

// terkmekek törlése route
router.delete("/termekek/:id", function (req, res) {
  const id = req.params.id;

  connection.query(
    "DELETE FROM terkmekek WHERE termekID=?",
    [id],
    (err, result) => {
      res.json("Sikeres törlés!");
    }
  );
});

// terkmekek szerkesztése route
router.put("/terkmekek/:id", upload.single("image"), function (req, res) {
  const id = req.params.id;
  const { name, termektipus, price } = req.body;
  const imageName = req.file ? req.file.filename : null;

  connection.query(
    "UPDATE terkmekek SET name = ?, termektipus = ?,price = ?, image = COALESCE(?, image) WHERE termekek.termekID = ?;",
    [name, termektipus, price, imageName, id],
    (err, result) => {
      res.json("Sikeres módosítás!");
    }
  );
});

// terkmekek közti keresés
router.post("/searching", function (req, res) {
  const searching = req.body.searching;

  connection.query(
    'SELECT * FROM terkmekek WHERE name LIKE CONCAT("%", ?, "%") OR termektipus LIKE CONCAT("%", ?, "%")',
    [searching, searching],
    (err, result) => {
      res.json(result);
      if (err) {
        console.log(err);
      }
    }
  );
});

// terkmekek közti keresés userID alapján
router.post("/searchingUser/:id", function (req, res) {
  const id = req.params.id;
  const searching = req.body.searching;

  connection.query(
    'SELECT termekek.*, AVG(r.rating) rating,COALESCE((SELECT rating FROM rating WHERE termekek.termekID = rating.termekID AND ? = rating.userID LIMIT 1),0) as userRating FROM termekek LEFT JOIN rating r USING(termekID) WHERE ( termekek.name LIKE CONCAT("%", ?, "%") OR termekek.termektipus LIKE CONCAT("%", ?, "%") ) GROUP BY termekID;',
    [id, searching, searching],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.json(result);
    }
  );
});

// egy adott terkmek értékelésének rögzítése egy adott felhasználótól
router.put("/rating/:termekID/:userID", function (req, res) {
  const termekID = req.params.termekID;
  const userID = req.params.userID;
  let rating = req.body.rating;

  connection.query(
    "SELECT * FROM rating WHERE termekID = ? AND userID = ?",
    [termekID, userID],
    async (err, result) => {
      if (result.length === 0) {
        // Nincs még értékelés az adott terkmekhez az adott felhasználótól
        connection.query(
          "INSERT INTO rating (ratingID, rating, userID, termekID) VALUES (NULL, ?, ?, ?)",
          [rating, userID, termekID],
          (err, result) => {
            updateAvgRating(termekID, res);
          }
        );
      } else {
        // Már van értékelés az adott terkmekhez az adott felhasználótól, ezért frissíteni kell
        connection.query(
          "UPDATE rating SET rating = ? WHERE seriesID = ? AND userID = ?",
          [rating, termekID, userID],
          (err, result) => {
            updateAvgRating(termekID, res);
          }
        );
      }
    }
  );
});

// az adott terkmek összértékelésének átlagának beszúrása
function updateAvgRating(termekID, res) {
  connection.query(
    "UPDATE terkmekek SET rating = (SELECT AVG(rating) FROM rating WHERE termekID = ?) WHERE termekID = ?",
    [termekID, termekID],
    (err, result) => {
      res.json({ success: true });
    }
  );
}

// az ár kiszámítása és az elérhető darabszám csökkentése
router.post("/ordering/:id", function (req, res) {
  const id = req.params.id;
  const stock = req.body.stock;

  connection.query(
    "SELECT stock, price FROM termekek WHERE termekID = ?",
    [id],
    (err, result) => {
      if (result[0].stock >= stock) {
        const buy = result[0].stock - stock;
        const price = result[0].price * stock;

        connection.query(
          "UPDATE termekek SET stock = ? WHERE termekID = ?",
          [buy, id],
          (err, result2) => {
            res.send({ success: true, price: price });
          }
        );
      } else {
        res.send({ success: false, available: result[0].stock });
      }
    }
  );
});

// a rendelés leadása
router.post("/payment", function (req, res) {
  const userID = req.cookies.userData.userID
  const { price, termekID,} = req.body;

  connection.query(
    "INSERT INTO `ordering` (`orderID`, `userID`, `termekID`, `orderDate`, `price`) VALUES (NULL, ?, ?, current_timestamp(), ?)",
    [userID, termekID, price],
    (err, result) => {
      res.json({ success: true });
    }
  );
});

module.exports = router;