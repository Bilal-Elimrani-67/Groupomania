const client = require("../config/sgbd");
const mysql = require("mysql");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/errors.utils");
let connection = client.client.getInstance();

module.exports.uploadProfil = async (req, res) => {
  try {
    console.log(req.file);
    if (
      req.file.detectedMimeType != "image/jpg" &&
      req.file.detectedMimeType != "image/png" &&
      req.file.detectedMimeType != "image/jpeg"
    )
      throw Error("invalid file");

    if (req.file.size > 500000) throw Error("max size");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
  const fileName = req.body.name + ".jpg";

  await pipeline(
    req.file.stream,
    fs.createWriteStream(
      `${__dirname}/../client/public/uploads/profil/${fileName}`
    )
  );
  console.log(req.body);
  let sql = `UPDATE users SET profil_pic = ${connection.escape(
    "./uploads/profil/" + fileName
  )} WHERE id=${req.body.userId}`;
  connection.query(sql, (errors, result, fields) => {
    if (errors) return res.status(500).json(errors);
    return res.status(200).json(result);
  });
  /*await UserModel.findByIdAndUpdate(
    req.body.userId,
    { $set: { picture: "./uploads/profil/" + fileName } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
    (err, docs) => {
      if (!err) return res.send(docs);
      else return res.status(500).send({ message: err });
    }
  );*/
};
