const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const mysql = require("mysql");
const client = require("../config/sgbd");
const Post = require("../models/post.models");
const Comment = require("../models/comment.models");
const Like = require("../models/like.models");
const User = require("../models/user.models");
let connection = client.client.getInstance();

module.exports.getAllPost = (req, res) => {
  let sql_request = (sql) => {
    connection.query(sql, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  };
  Post.fetch_all(sql_request);
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
  let parameters = [
    req.body.message,
    image_path,
    res.locals.user.id,
    req.body.video,
  ];
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  };
  Post.create(sql_request, parameters);
};

// Modifier un post
module.exports.updatePost = (req, res) => {
  let parameters = [req.body.message, req.params.id, res.locals.user.id];
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(sql);
      return res.status(200).json(result);
    });
  };
  Post.update(sql_request, parameters);
};

// Supprimer un post
module.exports.deletePost = (req, res) => {
  let parameters = [req.params.id, res.locals.user.id];
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  };
  Post.delete(sql_request, parameters);
};

// Aimer un post
module.exports.likePost = async (req, res) => {
  let parameters = [res.locals.user.id, req.params.id];
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  };
  Like.create(sql_request, parameters);
};

// Ne plus aimer un post
module.exports.unlikePost = async (req, res) => {
  let parameters = [res.locals.user.id, req.body.id];
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  };
  Like.delete(sql_request, parameters);
};

// Pour commenter un post
module.exports.commentPost = (req, res) => {
  let parameters = [req.body.text, res.locals.user.id, req.params.id];
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  };
  Comment.create(sql_request, parameters);
};

// Pour éditer le commentaire un post
module.exports.editCommentPost = (req, res) => {
  let parameters = [req.body.message, req.params.id, res.locals.user.id];
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  };
  Comment.update(sql_request, parameters);
};

// Pour supprimer le commentaire d'un post
module.exports.deleteCommentPost = (req, res) => {
  let parameters = [req.params.id, res.locals.user.id, res.locals.user.id];
  let sql_request = (sql, params) => {
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  };
  Comment.delete(sql_request, parameters);
};
