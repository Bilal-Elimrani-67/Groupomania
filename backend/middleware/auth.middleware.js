const mysql = require("mysql");
const client = require("../config/sgbd");
const connection = client.client.getInstance();
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

// Vérifie pour savoir si l'utilisateur est toujours connecté
module.exports.checkUser = (req, res, next) => {
  console.log("coucou");
  const token = req.cookies.jwt; // On se récupére le token
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        let remove_token = (sql, params) => {
          connection.query(sql, (errors, result, fields) => {
            if (errors) return res.status(500).json(errors);
            res.cookie("jwt", "", { maxAge: 1 }); // En milliseconde
            next();
          });
        };
        User.deleteToken(remove_token, token);
      } else {
        let get_user = (sql, params) => {
          connection.query(sql, params, (errors, result, fields) => {
            if (errors) {
              res.locals.user = null;
              return next();
            }

            res.locals.user = result[0];
            return next();
          });
        };
        User.get(get_user, decodedToken.id);
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// Controle si le token correspond à un user dans la BDD
module.exports.requireAuth = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.jwt; // On se récupére le token
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        let remove_token = (sql, params) => {
          connection.query(sql, (errors, result, fields) => {
            if (errors) return res.status(500).json(errors);
            res.cookie("jwt", "", { maxAge: 1 }); // En milliseconde
            return res.status(403).json("Utilisateur non connecté");
          });
        };
        User.deleteToken(remove_token, token);
      } else {
        next();
      }
    });
  } else {
    return res.status(403).json("Utilisateur non connecté");
  }
};
