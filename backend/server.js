const client = require("./config/sgbd");
const mysql = require("mysql");
let connection = client.client.getInstance();

const express = require("express"); // On require Express
const bodyParser = require("body-parser"); // Pour traiter et lire la data
const cookieParser = require("cookie-parser"); // Pour lire le cookie
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const cors = require("cors"); // On require cors

require("dotenv").config(); // Chemin pour aller dans le dossier
require("./config/sgbd");

const app = express();

// CORS
const corsOptions = {
  origin: process.env.CLIENT_URL, // Pret à recevoir les requêtes à cette URL
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions)); // On autorise tout le monde à faire des requêtes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// JWT
app.get("*", checkUser); // Check si l'user à bien un token
app.get("/jwtid", requireAuth, (req, res) => {
  if (res.locals.user == undefined) {
    return res.status(404).json("User not exist");
  }
  return res.status(200).json(res.locals.user.id); // Renvoie l'id de l'utilisateur
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Numéro du port + variable d'environnement
app.listen(process.env.PORT, async () => {
  console.log(`Listening on Port ${process.env.PORT}`); // Valeur dynamique
});
