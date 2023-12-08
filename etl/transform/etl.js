const { sequelize } = require("./server/db.js");
const { Reviews } = require("./postgres.js");
const fs = require("fs");
const csv = require("csv-parser");

let csvData = [];
fs.createReadStream("./data/reviews.csv")
  .pipe(csv())
  .on("data", (row) => {
    csvData.push(row);
  })
  .on("end", async () => {
    console.log("CSV file successfully processed");
    const transformed = csvData.map((row, index) => {
      try {
        return {
          review_id: parseInt(row.id, 10),
          rating: row.rating,
          createdAt: row.date,
          updatedAt: row.date,
          summary: row.summary,
          body: row.body,
          recommend: row.recommend,
          reviewer_name: row.reviewer_name,
          reviewer_email: row.reviewer_email,
        };
      } catch (error) {
        console.error(`Error processing row ${index + 1}:`, error);
        console.log("Problematic row:", row);
        return null;
      }
    });
    try {
      await sequelize.sync();
      await Reviews.bulkCreate(transformed);
      console.log("Data Loaded");
    } catch (err) {
      console.error("Error loading data", err);
    } finally {
      await sequelize.close();
    }
  });
