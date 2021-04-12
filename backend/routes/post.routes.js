const { checkUser, requireAuth } = require("../middleware/auth.middleware");
const router = require("express").Router(); // On se créer un routeur d'Express
const postController = require("../controllers/post.controller");
const multer = require("multer"); // Pour traiter les images
const upload = multer();

// Route Messages + Like & Unlike //

router.get("/", postController.getAllPost); // Pour obtenir tout les posts
router.post(
  "/",
  checkUser,
  requireAuth,
  upload.single("file"),
  postController.createPost
); // Pour poster un message
router.put("/:id", checkUser, requireAuth, postController.updatePost); // Pour modifier le post
router.delete("/:id", checkUser, requireAuth, postController.deletePost); // Pour supprimer le post
router.patch("/like-post/:id", checkUser, requireAuth, postController.likePost); // Pour liker
router.patch(
  "/unlike-post/:id",
  checkUser,
  requireAuth,
  postController.unlikePost
); // Pour unliker

// Router Commentaires //

router.patch(
  "/comment-post/:id",
  checkUser,
  requireAuth,
  postController.commentPost
); // Commenter un post
router.patch(
  "/edit-comment-post/:id",
  checkUser,
  requireAuth,
  postController.editCommentPost
); // Editer le commentaire d'un post
router.patch(
  "/delete-comment-post/:id",
  checkUser,
  requireAuth,
  postController.deleteCommentPost
); // Supprimer le commentaire

module.exports = router;
