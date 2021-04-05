class Comment {
  static create(callback, params) {
    let sql = `INSERT INTO comments(message,author,post) VALUES ( ?
    , ?, ?)`;
    callback(sql, params);
  }
  static update(callback, params) {
    let sql = `UPDATE comments SET message = ?
        WHERE id= ?
        AND author=?`;
    callback(sql, params);
  }
  static delete(callback, params) {
    let sql = `DELETE FROM comments WHERE id=?
       AND author=?`;
    callback(sql, params);
  }
}
