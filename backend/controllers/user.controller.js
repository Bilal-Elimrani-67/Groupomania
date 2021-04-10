const client = require("../config/sgbd");
const mysql = require("mysql");
const { response } = require("express");
const User = require("../models/user.models");
let connection = client.client.getInstance();

// Obtenir tout les utilisateurs
module.exports.getAllUsers = async (req, res) => {
  connection.query("SELECT * FROM users;", (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    return res.status(200).json(result);
  });
};

// Obtenir les infos d'un seul utilisateur
module.exports.userInfo = (req, res) => {
  let parameters = [req.params.id];
  let next = (res, result) => {
    if (result == []) return res.status(404).json(result);
    return res.status(200).json(result);
  };
  User.get(parameters, res, next);
};

// Modification d'un utilisateur
module.exports.updateUser = async (req, res) => {
  let parameters = [req.body.bio, res.locals.user.id];
  User.update(parameters, res);
};

// Suppression d'un utilisateur
module.exports.deleteUser = async (req, res) => {
  let parameters = [res.locals.user.id];
  User.delete(parameters, res);
};
