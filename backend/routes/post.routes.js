const router = require("express").Router(); // On se créer un routeur d'Express
const postController = require("../controllers/post.controller");
const multer = require("multer"); // Pour traiter les images
const upload = multer();

// Router Messages + Like & Unlike
router.get("/", postController.getAllPost);
router.get("/:id", postController.readPost); // Pour lire les messages
router.post("/", upload.single("file"), postController.createPost); // Pour poster un message
router.put("/:id", postController.updatePost); // On repère le post avec son id pour le modifier
router.delete("/:id", postController.deletePost); // On repère le post avec son id pour le supprimer
router.patch("/like-post/:id", postController.likePost); // On repère le post avec son id pour liker
router.patch("/unlike-post/:id", postController.unlikePost); // On repère le post avec son id pour unliker

// Router Commentaires
router.patch("/comment-post/:id", postController.commentPost); // Commenter un post
router.patch("/edit-comment-post/:id", postController.editCommentPost); // Editer le commentaire d'un post
router.patch("/delete-comment-post/:id", postController.deleteCommentPost); // Supprimer le commentaire

module.exports = router;
