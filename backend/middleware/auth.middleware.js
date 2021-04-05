const mysql = require("mysql");
const client = require("../config/sgbd");
const connection = client.client.getInstance();
const jwt = require("jsonwebtoken");

// Vérifie pour savoir si l'utilisateur est toujours connecté
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt; // On se récupére le token
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log("error verify token");
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 }); // En milliseconde
        next();
      } else {
        let sql = `SELECT id,email,pseudo FROM users WHERE id= ${connection.escape(
          decodedToken.id
        )}`;
        connection.query(sql, (errors, result, fields) => {
          if (errors) {
            res.locals.user = null;
            console.log("error select user");
            return next();
          }
          res.locals.user = result[0];
          return next();
        });
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// Controle si le token correspond à un user dans la BDD
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt; // On se récupére le token
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.send(200).json("no token");
      } else {
        console.log(decodedToken.id);
        next();
      }
    });
  } else {
    console.log("No token");
  }
};
