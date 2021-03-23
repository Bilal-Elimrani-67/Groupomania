const mysql = require("mysql");

let client = (() => {
  let instance;
  function createInstance() {
    let connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "my_db",
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
