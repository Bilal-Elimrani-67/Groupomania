const client = require("./config/sgbd");
const mysql = require("mysql");
const async = require("async");
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
  let prepare_request = [];
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
  console.log(`Listening on Port ${process.env.PORT}`); // Valeur dynamique
});
