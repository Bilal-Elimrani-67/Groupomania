const mysql = require("mysql");
const async = require("async");
require("dotenv").config();

let client = (() => {
  let instance;
  function setupSession(connection) {
    let prepare_request = [];
    prepare_request.push(
      `PREPARE get_users FROM "SELECT id,bio,pseudo FROM users";`
    );
    prepare_request.push(
      `PREPARE get_user_info FROM "SELECT id,email,bio,pseudo,profil_pic,created_at,permissions FROM users WHERE id=?";`
    );
    prepare_request.push(
      `PREPARE update_users_bio FROM "UPDATE users SET bio=? WHERE id=? ";`
    );
    prepare_request.push(
      `PREPARE update_users_pic FROM "UPDATE users SET profil_pic=? WHERE id=?";`
    );
    prepare_request.push(
      `PREPARE delete_users FROM "DELETE FROM users WHERE id=?";`
    );
    prepare_request.push(
      ` PREPARE delete_token FROM "UPDATE users SET token = NULL WHERE token= ?";`
    );
    prepare_request.push(
      `PREPARE get_user_by_pseudo FROM "SELECT pseudo FROM users WHERE pseudo=?";`
    );
    prepare_request.push(
      ` PREPARE get_user_by_email FROM "SELECT * FROM users WHERE email=?";`
    );
    prepare_request.push(
      ` PREPARE insert_user FROM "INSERT INTO users(pseudo, email, password) VALUES (?,?,?)";`
    );
    prepare_request.push(
      ` PREPARE set_token FROM "UPDATE users SET token = ? WHERE id= ?";`
    );
    prepare_request.push(
      ` PREPARE get_posts FROM "SELECT posts.id as id, posts.message as message, posts.author as author, posts.created_at as created_at, posts.image as image, posts.video as video, users.pseudo as pseudo, users.profil_pic as profil_pic, comments.id as comment_id, comments.message as comment_message, comments.author as comment_author, comments.create_at as comment_create_at, commenter.pseudo as comment_pseudo, commenter.profil_pic as comment_profil_pic, likes.author as like_author, likes.id as like_id  FROM posts right join users on posts.author=users.id left join likes on posts.id= likes.post left join comments on posts.id=comments.post left join users as commenter on comments.author= commenter.id order by posts.created_at desc";`
    );
    prepare_request.push(
      ` PREPARE insert_post FROM "INSERT INTO posts(message,image,author,video) VALUES (?, ?, ?, ?)";`
    );
    prepare_request.push(
      ` PREPARE update_post_message FROM "UPDATE posts SET message = ? WHERE id= ? AND author=?";`
    );
    prepare_request.push(
      ` PREPARE delete_post FROM "DELETE FROM posts WHERE id=? AND (author=? OR (SELECT permissions FROM users WHERE id= ?) = 1)";`
    );
    prepare_request.push(
      ` PREPARE insert_like FROM "INSERT INTO likes(author,post) VALUES(?,?)";`
    );
    prepare_request.push(
      ` PREPARE delete_like FROM "DELETE FROM likes WHERE author= ? AND post= ?";`
    );
    prepare_request.push(
      ` PREPARE insert_comment FROM "INSERT INTO comments(message,author,post) VALUES (?, ?, ?)"  `
    );
    prepare_request.push(
      ` PREPARE update_comment FROM "UPDATE comments SET message = ? WHERE (id= ? AND author= ?)"`
    );
    prepare_request.push(` PREPARE  delete_comment FROM "DELETE FROM comments WHERE id= ? AND (author= ? OR (SELECT permissions FROM users WHERE id= ?) = 1)"
  `);
    let execute_sql = [];
    prepare_request.forEach((request) => {
      execute_sql.push((callback) => {
        connection.query(request, (err, result, fields) => {
          callback(err, result);
        });
      });
    });
    async.parallel(execute_sql, (err, result) => {
      if (err) console.log(err);
    });
  }
  function createInstance() {
    let connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    connection.connect();
    setupSession(connection);
    console.log("Connected to MySQL");
    return connection;
  }
  return {
    getInstance: () => {
      if (!instance) instance = createInstance();
      return instance;
    },
  };
})();

exports.client = client;
