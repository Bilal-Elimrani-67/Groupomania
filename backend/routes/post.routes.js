const { checkUser, requireAuth } = require("../middleware/auth.middleware");
const router = require("express").Router(); // On se créer un routeur d'Express
const postController = require("../controllers/post.controller");
const multer = require("multer"); // Pour traiter les images
const upload = multer();

// Router Messages + Like & Unlike //

// Pour obtenir tout les posts
router.get("/", postController.getAllPost);

// Pour poster un message
router.post(
  "/",
  checkUser,
  requireAuth,
  upload.single("file"),
  postController.createPost
);

// On repère le post avec son id pour le modifier
router.put("/:id", checkUser, requireAuth, postController.updatePost);

// On repère le post avec son id pour le supprimer
router.delete("/:id", checkUser, requireAuth, postController.deletePost);

// On repère le post avec son id pour liker
router.patch("/like-post/:id", checkUser, requireAuth, postController.likePost);

// On repère le post avec son id pour unliker
router.patch(
  "/unlike-post/:id",
  checkUser,
  requireAuth,
  postController.unlikePost
);

// Router Commentaires //

// Commenter un post
router.patch(
  "/comment-post/:id",
  checkUser,
  requireAuth,
  postController.commentPost
);

// Editer le commentaire d'un post
router.patch(
  "/edit-comment-post/:id",
  checkUser,
  requireAuth,
  postController.editCommentPost
);

// Supprimer le commentaire
router.patch(
  "/delete-comment-post/:id",
  checkUser,
  requireAuth,
  postController.deleteCommentPost
);

module.exports = router;
