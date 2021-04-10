const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.models");

// Enregistrer un utilisateur
module.exports.signUp = async (req, res) => {
  let { pseudo, email, password } = req.body;
  let reg = new RegExp(/\s/g, "g");
  password = password.replace(reg, "");
  reg = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    "i"
  );
  email_pass = reg.test(email);
  if (!email_pass) {
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
      let parameters = [pseudo, email, hash];
      User.signUp(parameters, res);
    });
  });
};

// Connecter un utilisateur
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  if (email === "") {
    return res.status(200).json({
      pseudo: "",
      email: "Veuillez entrer un email",
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
  let parameters = [email, password];
  User.signIn(parameters, res);
};

// Déconnecter un utilisateur
module.exports.logout = (req, res) => {
  let next = (res) => {
    res.status(200).json("OK");
  };
  User.deleteToken(req.cookies.jwt, res, next);
};
