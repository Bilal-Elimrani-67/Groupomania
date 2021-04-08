module.exports = class Like {
  static create(callback, params) {
    let sql = `INSERT INTO likes(author,post) VALUES(?,?)`;
    callback(sql, params);
  }
  static delete(callback, params) {
    let sql = `DELETE FROM likes WHERE author= ? AND post= ?`;
    callback(sql, params);
  }
};
