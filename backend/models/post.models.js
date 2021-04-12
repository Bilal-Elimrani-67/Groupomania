const client = require("../config/sgbd");
const mysql = require("mysql");
let connection = client.client.getInstance();

module.exports = class Post {
  // Pour obtenir tout les post
  static fetch_all(res) {
    let sql = `EXECUTE get_posts `;
    connection.query(sql, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
  // Pour créer un post
  static create(params, res) {
    let sql = `EXECUTE insert_post using ?,?,?,? `;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
  // Pour modifier un post
  static update(params, res) {
    let sql = `EXECUTE update_post_message using ?,?,? `;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(sql);
      return res.status(200).json(result);
    });
  }
  // Pour supprimer un post
  static delete(params, res) {
    let sql = `EXECUTE delete_post using ?,?,? `;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  }
};
