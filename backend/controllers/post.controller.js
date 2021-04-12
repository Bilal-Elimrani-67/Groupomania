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

// Pour obtenir tout les post
module.exports.getAllPost = (req, res) => {
  Post.fetch_all(res);
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

  if (res.locals.user == null)
    return res.status(403).json("Utilisateur non valide");
  let parameters = [
    req.body.message,
    image_path,
    res.locals.user.id,
    req.body.video,
  ];
  Post.create(parameters, res);
};

// Modifier un post
module.exports.updatePost = (req, res) => {
  let parameters = [req.body.message, req.params.id, res.locals.user.id];
  Post.update(parameters, res);
};

// Supprimer un post
module.exports.deletePost = (req, res) => {
  let parameters = [req.params.id, res.locals.user.id, res.locals.user.id];
  Post.delete(parameters, res);
};

// Aimer un post
module.exports.likePost = async (req, res) => {
  let parameters = [res.locals.user.id, req.params.id];
  Like.create(parameters, res);
};

// Ne plus aimer un post
module.exports.unlikePost = async (req, res) => {
  let parameters = [res.locals.user.id, req.params.id];
  Like.delete(parameters, res);
};

// Pour commenter un post
module.exports.commentPost = (req, res) => {
  let parameters = [req.body.text, res.locals.user.id, req.params.id];
  Comment.create(parameters, res);
};

// Pour éditer le commentaire un post
module.exports.editCommentPost = (req, res) => {
  let parameters = [req.body.message, req.params.id, res.locals.user.id];
  Comment.update(parameters, res);
};

// Pour supprimer le commentaire d'un post
module.exports.deleteCommentPost = (req, res) => {
  let parameters = [req.params.id, res.locals.user.id, res.locals.user.id];
  Comment.delete(parameters, res);
};
