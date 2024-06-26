const mysql = require("mysql2/promise");
const mySqlPool = mysql.createPool({
  host: "srv1267.hstgr.io",
  user: "u323738017_scrapy_user",
  password: "Scrapy@0001",
  database: "u323738017_scrapy",
});

module.exports = mySqlPool;
