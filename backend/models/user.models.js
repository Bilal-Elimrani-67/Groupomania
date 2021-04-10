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

module.exports = class User {
  static get(params, res, callback) {
    let sql = `EXECUTE get_user_info using ?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result == []) return res.status(404).json(result);
      return callback(res, result);
    });
  }
  static getByPseudo(callback, params) {
    let sql = `SELECT pseudo FROM users WHERE pseudo=?`;
    callback(sql, params);
  }
  static getByEmail(callback, params) {
    let sql = `SELECT * FROM users WHERE email=?`;
    callback(sql, params);
  }
  static getByToken(callback, params) {
    let sql = `SELECT id,token FROM users WHERE token LIKE ?`;
    callback(sql, params);
  }
  static create(callback, params) {
    let sql = `INSERT INTO users(pseudo, email, password) VALUES (?,?,?)`;
    callback(sql, params);
  }
  static update(params, res) {
    let sql = `UPDATE users SET bio = ? WHERE id= ?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  }
  static updateProfilPic(params, res) {
    let sql = `UPDATE users SET profil_pic = ? WHERE id= ?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
  static addToken(callback, params) {
    let sql = `UPDATE users SET token = ? WHERE id= ?`;
    callback(sql, params);
  }
  static delete(params, res) {
    let sql = `DELETE FROM users WHERE id=?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  }
  static deleteToken(params, res, callback) {
    let sql = `UPDATE users SET token = NULL WHERE token= ?`;
    connection.query(sql, params, (err, result, fields) => {
      if (err) return res.status(500).json(err);
      res.cookie("jwt", "", { maxAge: 1 }); // En milliseconde
      return callback(res);
    });
  }
  static signUp(params, res) {
    let sql = `SELECT pseudo FROM users WHERE pseudo=?`;
    connection.query(sql, params[0], (err, result, fields) => {
      if (err) {
        if (err.errno == 1062) {
        }
        return res.status(500).json(err);
      }
      if (JSON.stringify(result) !== JSON.stringify([])) {
        return res.status(200).json({
          pseudo: "Ce pseudo est déjà pris",
          email: "",
          password: "",
          errors: "Erreur",
        });
      }

      sql = `SELECT * FROM users WHERE email=?`;
      connection.query(sql, params[1], (err, result, fields) => {
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

        sql = `INSERT INTO users(pseudo, email, password) VALUES (?,?,?)`;
        connection.query(sql, params, (err, result, fields) => {
          if (err) {
            return res.status(500).json(err);
          }
          return res.status(200).json(result);
        });
      });
    });
  }
  static signIn(params, res) {
    let sql = `SELECT * FROM users WHERE email=?`;
    connection.query(sql, params[0], (err, result, fields) => {
      if (err) return res.status(500).json(err);
      if (!result[0]) {
        return res.status(200).json({
          email: "Email incorrect",
          password: "",
          errors: "Erreur",
        });
      }
      let password = params[1];
      bcrypt.compare(password, result[0].password, (errors, results) => {
        if (results) {
          const uid = result[0].id;
          const token = createToken(result[0].id);
          sql = `UPDATE users SET token = ? WHERE id= ?`;
          connection.query(sql, [token, uid], (err, result, fields) => {
            if (err) return res.status(500).json(err);
            res.cookie("jwt", token, { httpOnly: true, maxAge }); // Sécurité du cookie
            return res.status(200).json({ user: uid });
          });
        } else {
          return res.status(200).json({
            email: "",
            password: "Mot de passe incorrect",
            errors: "Erreur",
          });
        }
      });
    });
  }
};
