const client = require("../config/sgbd");
const mysql = require("mysql");
const { response } = require("express");
let connection = client.client.getInstance();

module.exports.getAllUsers = async (req, res) => {
  connection.query("SELECT * FROM users;", (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);

    return res.status(200).json(result);
  });
};

module.exports.userInfo = (req, res) => {
  console.log(req.params.id);
  let sql = `SELECT id,email,bio,pseudo,profil_pic,created_at FROM users WHERE id=${connection.escape(
    req.params.id
  )};`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    if (result == []) return res.status(404).json(result);
    return res.status(200).json(result);
  });
};

module.exports.updateUser = async (req, res) => {
  /*if (req.params.id !== res.locals.user.id) {
    return res.status(403).json("Forbidden");
  }*/
  let id = req.params.id;
  let bio = req.body.bio;
  let sql = `UPDATE users SET bio = ${connection.escape(
    bio
  )} WHERE id= ${connection.escape(id)}`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    if (result.affectedRows < 1) return res.status(404).json(result);
    return res.status(200).json(result);
  });
};

module.exports.deleteUser = async (req, res) => {
  let sql = `DELETE FROM users WHERE id=${connection.escape(req.params.id)};`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    if (result.affectedRows < 1) return res.status(404).json(result);
    return res.status(200).json(result);
  });
};
