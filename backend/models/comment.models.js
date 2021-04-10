const client = require("../config/sgbd");
const mysql = require("mysql");
let connection = client.client.getInstance();

module.exports = class Comment {
  static create(params, res) {
    let sql = `INSERT INTO comments(message,author,post) VALUES (?, ?, ?)`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
  static update(params, res) {
    let sql = `UPDATE comments SET message = ? WHERE (id= ? AND author= ?)`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  }
  static delete(params, res) {
    let sql = `DELETE FROM comments WHERE id= ? AND (author= ? OR (SELECT permissions FROM users WHERE id= ?) = 1)`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  }
};
