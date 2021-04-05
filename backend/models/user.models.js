class User {
  static get(callback, params) {
    let sql = `SELECT id,email,bio,pseudo,profil_pic,created_at FROM users WHERE id=?`;
    callback(sql, params);
  }
  static getByPseudo(callback, params) {
    let sql = `SELECT pseudo FROM users WHERE pseudo=?`;
    callback(sql, params);
  }
  static getByEmail(callback, params) {
    let sql = `SELECT * FROM users WHERE email=?`;
    callback(sql, params);
  }
  static create(callback, params) {
    let sql = `INSERT INTO users(pseudo, email, password) VALUES (?,?,?)`;
    callback(sql, params);
  }
  static update(callback, params) {
    let sql = `UPDATE users SET bio = ?
    WHERE id= ?`;
    callback(sql, params);
  }
  static delete(callback, params) {
    let sql = `DELETE FROM users WHERE id=?`;
    callback(sql, params);
  }
}
