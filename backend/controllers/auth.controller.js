const client = require("../config/sgbd");
const mysql = require("mysql");
let connection = client.client.getInstance();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signUp = async (req, res) => {
  console.log(req.body);
  let { pseudo, email, password } = req.body;

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

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  let sql = `SELECT * FROM users WHERE email= ${connection.escape(email)}`;
  connection.query(sql, (err, result, fields) => {
    if (err) return res.status(500).json(err);
    if (!result) return res.status(404).json(result);
    console.log(result[0].password);
    bcrypt.compare(password, result[0].password, (errors, results) => {
      if (results) {
        const token = createToken(result[0].id);
        res.cookie("jwt", token, { httpOnly: true, maxAge });
        return res.status(200).json({ user: result[0].id });
      }
      return res.status(403).json(results);
    });
  });
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  return res.status(200).json("OK");
};
