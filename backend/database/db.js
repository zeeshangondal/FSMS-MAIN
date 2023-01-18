const mysql = require('mysql');


class DB {
  static connection
  static connectToDB() {
    DB.connection = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "",
      database: "FSMS"
    });
  }

  static execQuery = (sql, args)=> {
    return new Promise((resolve, reject) => {
      DB.connection.query(sql, args, (err, rows) => {
        if (err)
          return reject(err);
        resolve(rows);
      });
    });
  }
  static close() {
    return new Promise((resolve, reject) => {
      DB.connection.end(err => {
        if (err)
          return reject(err);
        resolve();
      });
    });
  }






}

module.exports = DB

