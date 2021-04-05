const mysql = require("mysql");
require("dotenv").config();

let client = (() => {
  let instance;
  function createInstance() {
    let connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    connection.connect();
    console.log("Connected to MySQL");
    return connection;
  }
  return {
    getInstance: () => {
      if (!instance) instance = createInstance();
      return instance;
    },
  };
})();

exports.client = client;
