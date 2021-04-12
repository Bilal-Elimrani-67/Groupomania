const client = require("../config/sgbd");
const mysql = require("mysql");
let connection = client.client.getInstance();

module.exports = class Comment {
  // Pour créer un commentaire
  static create(params, res) {
    let sql = `EXECUTE insert_comment using ?,?,?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
  // Pour modifier un commentaire
  static update(params, res) {
    let sql = `EXECUTE update_comment using ?,?,? `;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  }
  // Pour supprimer un commentaire
  static delete(params, res) {
    let sql = `EXECUTE delete_comment using ?,?,?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  }
};
