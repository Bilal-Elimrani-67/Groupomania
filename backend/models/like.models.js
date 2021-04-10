const client = require("../config/sgbd");
const mysql = require("mysql");
let connection = client.client.getInstance();

module.exports = class Like {
  static create(params, res) {
    let sql = `INSERT INTO likes(author,post) VALUES(?,?)`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
  static delete(params, res) {
    let sql = `DELETE FROM likes WHERE author= ? AND post= ?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
};
