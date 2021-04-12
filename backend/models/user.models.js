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
  // Pour obtenir toutes les infos
  static fetch(params, res) {
    connection.query("EXECUTE get_users ", (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
  // Pour obtenir l'info d'un utilisateur
  static get(params, res, callback) {
    let sql = `EXECUTE get_user_info using ?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result == []) return res.status(404).json(result);
      return callback(res, result);
    });
  }
  // Pour modifier sa bio
  static update(params, res) {
    let sql = `EXECUTE update_users_bio using ? , ?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  }
  // Pour modifier sa photo de profil
  static updateProfilPic(params, res) {
    let sql = `EXECUTE update_users_pic using ? , ?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      return res.status(200).json(result);
    });
  }
  // Pour supprimer un utilisateur
  static delete(params, res) {
    let sql = `EXECUTE delete_users using ?`;
    connection.query(sql, params, (errors, result, fields) => {
      if (errors) return res.status(500).json(errors);
      if (result.affectedRows < 1) return res.status(404).json(result);
      return res.status(200).json(result);
    });
  }
  // Pour se deconnecter
  static deleteToken(params, res, callback) {
    let sql = `EXECUTE delete_token using ? `;
    connection.query(sql, params, (err, result, fields) => {
      if (err) return res.status(500).json(err);
      res.cookie("jwt", "", { maxAge: 1 }); // En milliseconde
      return callback(res);
    });
  }
  // Pour s'enregister
  static signUp(params, res) {
    let sql = `EXECUTE get_user_by_pseudo using ?`;
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

      sql = `EXECUTE get_user_by_email using ?`;
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

        sql = `EXECUTE insert_user using ?,?,?`;
        connection.query(sql, params, (err, result, fields) => {
          if (err) {
            return res.status(500).json(err);
          }
          return res.status(200).json(result);
        });
      });
    });
  }
  // Pour se connecter
  static signIn(params, res) {
    let sql = `EXECUTE get_user_by_email using ?`;
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
          sql = `EXECUTE set_token using ?, ?`;
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
