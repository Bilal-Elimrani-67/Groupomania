const client = require("../config/sgbd");
const mysql = require("mysql");
let connection = client.client.getInstance();

module.exports = class Post {
  static fetch_all(res) {
    let sql = `SELECT posts.id as id, posts.message as message, posts.author as author, posts.created_at as created_at, posts.image as image, posts.video as video, users.pseudo as pseudo, users.profil_pic as profil_pic, comments.id as comment_id, comments.message as comment_message, comments.author as comment_author, comments.create_at as comment_create_at, commenter.pseudo as comment_pseudo, commenter.profil_pic as comment_profil_pic, likes.author as like_author, likes.id as like_id  FROM posts right join users on posts.author=users.id left join likes on posts.id= likes.post left join comments on posts.id=comments.post left join users as commenter on comments.author= commenter.id order by posts.created_at desc`;
    connection.query(sql, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
  static create(params, res) {
    let sql = `INSERT INTO posts(message,image,author,video) VALUES (?, ?, ?, ?)`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
  static update(params, res) {
    let sql = `UPDATE posts SET message = ? WHERE id= ? AND author=?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(sql);
      return res.status(200).json(result);
    });
  }
  static delete(params, res) {
    let sql = `DELETE FROM posts WHERE id=? AND (author=? OR (SELECT permissions FROM users WHERE id= ?) = 1)`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  }
};
