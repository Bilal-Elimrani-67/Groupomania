const client = require("../config/sgbd");
const mysql = require("mysql");
let connection = client.client.getInstance();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3j * En milliseconde

// Création du token + Clé secrète pour déchiffrer le token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// Enregistrer un utilisateur
module.exports.signUp = async (req, res) => {
  console.log(req.body);
  let { pseudo, email, password } = req.body;
  let reg = new RegExp(/\s/g, "g");
  password = password.replace(reg, "");
  reg = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    "i"
  );
  email_pass = reg.test(email);
  if (!email_pass) {
    console.log("ien");
    return res.status(200).json({
      pseudo: "",
      email: "Format email incorrect",
      password: "",
      errors: "Erreur",
    });
  }
  if (password === "") {
    return res.status(200).json({
      pseudo: "",
      email: "",
      password: "Veuillez entrer un mot de passe",
      errors: "Erreur",
    });
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).json(err);
    bcrypt.hash(password, salt, (errors, hash) => {
      if (errors == {}) return res.status(500).json(errors);
      let sql = `SELECT pseudo FROM users WHERE pseudo=${connection.escape(
        pseudo
      )}`;
      connection.query(sql, (err, result, fields) => {
        if (err) {
          if (err.errno == 1062) {
          }
          return res.status(500).json(err);
        }
        if (JSON.stringify(result) !== JSON.stringify([])) {
          console.log(result);
          return res.status(200).json({
            pseudo: "Ce pseudo est déjà pris",
            email: "",
            password: "",
            errors: "Erreur",
          });
        }
        sql = `SELECT email FROM users WHERE email=${connection.escape(email)}`;
        connection.query(sql, (err, result, fields) => {
          if (err) {
            return res.status(500).json(err);
          }
          if (JSON.stringify(result) !== JSON.stringify([])) {
            return res.status(200).json({
              pseudo: "",
              email: "Email déjà pris",
              password: "",
              errors: "Erreur",
            });
          }
          sql = `INSERT INTO users(pseudo, email, password) VALUES ( ?
      ,  ?,  ?
      )`;
          connection.query(
            sql,
            [pseudo, email, hash],
            (err, result, fields) => {
              if (err) {
                return res.status(500).json(err);
              }
              return res.status(200).json(result);
            }
          );
        });
      });
    });
  });
};

// Connecter un utilisateur
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  if (password === "") {
    return res.status(200).json({
      pseudo: "",
      email: "",
      password: "Veuillez entrer un mot de passe",
      errors: "Erreur",
    });
  }
  let sql = `SELECT * FROM users WHERE email= ${connection.escape(email)}`;
  connection.query(sql, (err, result, fields) => {
    if (err) return res.status(500).json(err);
    if (!result[0]) {
      return res.status(200).json({
        email: "Email incorrect",
        password: "",
        errors: "Erreur",
      });
    }
    bcrypt.compare(password, result[0].password, (errors, results) => {
      if (results) {
        const token = createToken(result[0].id);
        res.cookie("jwt", token, { httpOnly: true, maxAge }); // Sécurité du cookie
        return res.status(200).json({ user: result[0].id });
      }
      return res.status(200).json({
        email: "",
        password: "Mot de passe incorrect",
        errors: "Erreur",
      });
    });
  });
};

// Déconnecter un utilisateur
module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 }); // En milliseconde
  return res.status(200).json("OK");
};
