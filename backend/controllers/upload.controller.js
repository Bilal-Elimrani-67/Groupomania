const client = require("../config/sgbd");
const mysql = require("mysql");
const fs = require("fs"); // FileSystem : Pour incrémenter des élements dans des fichier
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/errors.utils");
let connection = client.client.getInstance();

// Mettre une image dans le profil
module.exports.uploadProfil = async (req, res) => {
  try {
    console.log(req.file);
    if (
      req.file.detectedMimeType != "image/jpg" &&
      req.file.detectedMimeType != "image/png" &&
      req.file.detectedMimeType != "image/jpeg"
    )
      throw Error("invalid file"); // On jete l'erreur

    if (req.file.size > 500000) throw Error("max size"); //Ko
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
  const fileName = req.body.name + ".jpg";

  await pipeline(
    req.file.stream,
    fs.createWriteStream(`../frontend/public/uploads/profil/${fileName}`) //Dans ce chemin on créer le fichier
  );
  console.log(req.body);
  let sql = `UPDATE users SET profil_pic = ${connection.escape(
    "./uploads/profil/" + fileName
  )} WHERE id=${req.body.userId}`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    return res.status(200).json(result);
  });
};
