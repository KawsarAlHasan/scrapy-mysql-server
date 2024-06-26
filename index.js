const express = require("express");
const dotenv = require("dotenv");
const mySqlPool = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
dotenv.config();

const globalCorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(globalCorsOptions));
app.options("*", cors(globalCorsOptions));

// Alternatively, you can allow all origins by simply calling app.use(cors());
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

// routes
app.use("/api/v1/scrapped-data", require("./routes/scrappedDataRoute"));

// port
const port = process.env.PORT || 5100;

// contidionaly listen
mySqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("MYSQL DB Connected");

    // listen
    app.listen(port, () => {
      console.log(`Scrapy Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.status(200).send("Scrapy is working");
});
