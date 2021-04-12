const mysql = require("mysql");
const client = require("../config/sgbd");
const connection = client.client.getInstance();
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

// Vérifie pour savoir si l'utilisateur est toujours connecté
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt; // On se récupére le token
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        let next_func = (res) => {
          next();
        };
        User.deleteToken(token, res, next_func);
      } else {
        let next_func = (res, result) => {
          if (result == []) result.locals.user = null;
          else res.locals.user = result[0];
          next();
        };
        User.get(decodedToken.id, res, next_func);
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// Verifie que l'utilisateur est ben celui qu'il prétend être
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt; // On se récupére le token
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        let next_func = (res) => {
          next();
        };
        User.deleteToken(token, res, next_func);
      } else {
        next();
      }
    });
  } else {
    return res.status(403).json("Utilisateur non connecté");
  }
};
