const { checkUser, requireAuth } = require("../middleware/auth.middleware");
const router = require("express").Router(); // On se créer un routeur d'Express
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const uploadController = require("../controllers/upload.controller");
const multer = require("multer"); // Pour traiter les images
const upload = multer();

// Route Authentification
router.post("/register", authController.signUp); // Pour enregistrer un utilisateur
router.post("/login", authController.signIn); // Pour connecter un utilisateur
router.get("/logout", authController.logout); // Pour déconnecter un utilisateur

// Route Utilisateur(s)
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo); // :id => c'est un paramètre (req.params)
router.put("/:id", checkUser, requireAuth, userController.updateUser);
router.delete("/:id", checkUser, requireAuth, userController.deleteUser);

// Route téléchargement image de profil
router.post(
  "/upload",
  checkUser,
  requireAuth,
  upload.single("file"),
  uploadController.uploadProfil
);

module.exports = router;
