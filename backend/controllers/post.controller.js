const { uploadErrors } = require("../utils/errors.utils");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const mysql = require("mysql");
const client = require("../config/sgbd");
let connection = client.client.getInstance();

module.exports.getAllPost = (req, res) => {
  let sql = `SELECT posts.id as id, posts.message as message, posts.author as author, posts.created_at as created_at, posts.image as image, posts.video as video, users.pseudo as pseudo, users.profil_pic as profil_pic, comments.id as comment_id, comments.message as comment_message, comments.author as comment_author, comments.create_at as comment_create_at, commenter.pseudo as comment_pseudo, commenter.profil_pic as comment_profil_pic, likes.author as like_author, likes.id as like_id  FROM posts right join users on posts.author=users.id left join likes on posts.id= likes.post left join comments on posts.id=comments.post left join users as commenter on comments.author= commenter.id order by posts.created_at desc`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    return res.status(200).json(result);
  });
};

// Lire un post
module.exports.readPost = (req, res) => {
  let sql = `SELECT * FROM posts WHERE id=${connection.escape(req.params.id)}`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    if (result == []) return res.status(404).json(result);

    sql = `SELECT id,pseudo,profil_pic FROM users WHERE id=${result[0].author}`;
    connection.query(sql, (errors, resUsers, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result == []) return res.status(404).json(result);
      let response = result[0];
      response.user = resUsers[0];
      console.log(response);
      return res.status(200).json(response);
    });
  });
};

// Créer un post
module.exports.createPost = async (req, res) => {
  let fileName;
  if (req.file !== null && req.file !== undefined) {
    try {
      if (
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/png" &&
        req.file.detectedMimeType != "image/jpeg"
      )
        throw Error("invalid file");

      if (req.file.size > 500000) throw Error("max size");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(201).json({ errors });
    }
    fileName = req.body.posterId + Date.now() + ".jpg";
    await pipeline(
      req.file.stream,
      fs.createWriteStream(`../frontend/public/uploads/posts/${fileName}`)
    );
  }
  let image_path =
    req.file !== null && req.file !== undefined
      ? "./uploads/posts/" + fileName
      : "";
  let sql = `INSERT INTO posts(message,image,author,video) VALUES ( ${connection.escape(
    req.body.message
  )},  ${connection.escape(image_path)},  ${connection.escape(
    req.body.posterId
  )}, ${connection.escape(req.body.video)})`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    return res.status(200).json(result);
  });
};

// Modifier un post
module.exports.updatePost = (req, res) => {
  let sql = `UPDATE posts SET message = ${connection.escape(
    req.body.message
  )} WHERE id= ${connection.escape(
    req.params.id
  )} AND author=${connection.escape(req.body.posterId)}`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    if (result.affectedRows < 1) return res.status(404).json(sql);
    return res.status(200).json(result);
  });
};

// Supprimer un post
module.exports.deletePost = (req, res) => {
  let sql = `DELETE FROM posts WHERE id=${connection.escape(
    req.params.id
  )} AND( author=${connection.escape(req.body.posterId)})`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    if (result.affectedRows < 1) return res.status(404).json(result);
    return res.status(200).json(result);
  });
};

// Aimer un post
module.exports.likePost = async (req, res) => {
  let sql = `INSERT INTO likes(author,post) VALUES(${connection.escape(
    req.body.id
  )}, ${connection.escape(req.params.id)})`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    return res.status(200).json(result);
  });
};

// Ne plus aimer un post
module.exports.unlikePost = async (req, res) => {
  let sql = `DELETE FROM likes WHERE post= ${connection.escape(
    req.params.id
  )} AND author=${connection.escape(req.body.id)}`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    return res.status(200).json(result);
  });
};

module.exports.commentPost = (req, res) => {
  let sql = `INSERT INTO comments(message,author,post) VALUES ( ${connection.escape(
    req.body.text
  )},  ${connection.escape(req.body.commenterId)},  ${connection.escape(
    req.params.id
  )})`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    return res.status(200).json(result);
  });
};

module.exports.editCommentPost = (req, res) => {
  let sql = `UPDATE comments SET message = ${connection.escape(
    req.body.message
  )} WHERE id= ${connection.escape(
    req.params.id
  )} AND author=${connection.escape(req.body.userId)}`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    if (result.affectedRows < 1) return res.status(404).json(result);
    return res.status(200).json(result);
  });
};

module.exports.deleteCommentPost = (req, res) => {
  let sql = `DELETE FROM comments WHERE id=${connection.escape(
    req.params.id
  )} AND( author=${connection.escape(req.body.userId)} )`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    if (result.affectedRows < 1) return res.status(404).json(result);
    return res.status(200).json(result);
  });
};
