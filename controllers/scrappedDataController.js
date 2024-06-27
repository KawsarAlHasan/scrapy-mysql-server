const db = require("../config/db");

exports.getAllscrappedData = async (req, res) => {
  try {
    let {
      search,
      reviewer_name,
      reviewdate,
      avg_rating,
      Source_Name,
      Source_Website,
      Company_category,
      sort,
      review_star,
      page,
      limit,
    } = req.query;

    // Default values
    sort = sort || "id";
    review_star = review_star || "";
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 100;
    const offset = (page - 1) * limit;

    if (!search && !reviewer_name) {
      search = search || "";
    }

    // Construct the main query
    let query =
      "SELECT * FROM Scrapped_Data WHERE (Company_name LIKE ? OR reviewer_name LIKE ? )";
    let params = [`%${search}%`, `%${reviewer_name}%`];

    // Add reviewdate condition if provided
    if (reviewdate) {
      query += " AND review_date = ?";
      params.push(reviewdate);
    }
    if (avg_rating) {
      query += " AND avg_rating = ?";
      params.push(avg_rating);
    }
    if (Source_Name) {
      query += " AND Source_Name = ?";
      params.push(Source_Name);
    }
    if (Source_Website) {
      query += " AND Source_Website = ?";
      params.push(Source_Website);
    }
    if (Company_category) {
      query += " AND Company_category = ?";
      params.push(Company_category);
    }

    // Add review_star condition if provided
    if (review_star) {
      query += " AND review_star = ?";
      params.push(review_star);
    }

    // Add sort condition
    query += ` ORDER BY ${sort}`;

    // Add pagination
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Execute the main query
    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).send({
        success: true,
        message: "No Scrapped Data found",
      });
    }

    // Construct the total count query
    let totalQuery =
      "SELECT COUNT(*) as count FROM Scrapped_Data WHERE (Company_name LIKE ? OR reviewer_name LIKE ? )";
    let totalParams = [`%${search}%`, `%${reviewer_name}%`];

    if (reviewdate) {
      totalQuery += " AND review_date = ?";
      totalParams.push(reviewdate);
    }

    if (review_star) {
      totalQuery += " AND review_star = ?";
      totalParams.push(review_star);
    }

    if (avg_rating) {
      totalQuery += " AND avg_rating = ?";
      totalParams.push(avg_rating);
    }
    if (Source_Name) {
      totalQuery += " AND Source_Name = ?";
      totalParams.push(Source_Name);
    }
    if (Source_Website) {
      totalQuery += " AND Source_Website = ?";
      totalParams.push(Source_Website);
    }
    if (Company_category) {
      totalQuery += " AND Company_category = ?";
      totalParams.push(Company_category);
    }

    // Execute the total count query
    const [[{ count }]] = await db.query(totalQuery, totalParams);

    res.status(200).send({
      success: true,
      message: "All Scrapped Data",
      totalScrappedData: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Scrapped Data",
      error: error.message,
    });
  }
};

exports.getScrappedDataById = async (req, res) => {
  try {
    const scrappedId = req.params.id;
    if (!scrappedId) {
      return res.status(404).send({
        success: false,
        message: "Invalid of provide Scrapped id",
      });
    }
    const data = await db.query(`SELECT * FROM Scrapped_Data WHERE id=?`, [
      scrappedId,
    ]);
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "No Scrapped  found",
      });
    }
    const scrapped = data[0];
    res.status(200).send(scrapped);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get Scrapped",
      error,
    });
  }
};
