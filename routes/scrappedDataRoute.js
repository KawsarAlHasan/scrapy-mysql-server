const express = require("express");
const {
  getAllscrappedData,
  getScrappedDataById,
} = require("../controllers/scrappedDataController");

const router = express.Router();

router.get("/all", getAllscrappedData); // get all scrapped Data
router.get("/:id", getScrappedDataById); // get all scrapped Data

module.exports = router;
