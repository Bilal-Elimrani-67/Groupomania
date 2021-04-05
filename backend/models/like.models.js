class Like {
  static create(callback, params) {
    let sql = `INSERT INTO likes(author,post) VALUES(?,
    ?`;
    callback(sql, params);
  }
  static delete(callback, params) {
    let sql = `INSERT INTO likes(author,post) VALUES(?,
    ?`;
    callback(sql, params);
  }
}
