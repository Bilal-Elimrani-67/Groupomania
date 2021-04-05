const client = require("../config/sgbd");
const mysql = require("mysql");
const { response } = require("express");
const user = require("../models/user.models");
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
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result == []) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  };
  User.get(sql_request, parameters);
};

// Modification d'un utilisateur
module.exports.updateUser = async (req, res) => {
  let parameters = [req.body.bio, req.params.id];
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  };
  User.update(sql_request, parameters);
};

// Suppression d'un utilisateur
module.exports.deleteUser = async (req, res) => {
  let parameters = [req.params.id];
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  };
  User.delete(sql_request, parameters);
};
