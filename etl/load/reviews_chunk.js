const { sequelize } = require("./server/db.js");
const { Reviews } = require("./postgres.js");
const fs = require("fs");
const csv = require("csv-parser");

const batchSize = 100;
let transformedData = [];
let rowCount = 0;

function transformRow(row) {
  return {
    review_id: parseInt(row.id, 10),
    rating: row.rating,
    createdAt: row.date,
    summary: row.summary,
    body: row.body,
    recommend: row.recommend,
    reviewer_name: row.reviewer_name,
    reviewer_email: row.reviewer_email,
  };
}
async function insertBatchIntoDatabase(data) {
  try {
    await Reviews.bulkCreate(data, { validate: true });
    console.log(`Inserted batch of ${data.length} rows into the database`);
  } catch (err) {
    console.error("Error inserting batch into database", err);
  }
}

fs.createReadStream("./data/reviews.csv")
  .pipe(csv())
  .on("data", (row) => {
    const transformedRow = transformRow(row);
    transformedData.push(transformedRow);

    rowCount++;

    if (transformedData.length >= batchSize) {
      insertBatchIntoDatabase([...transformedData]);
      transformedData = [];
    }
  })
  .on("end", () => {
    if (transformedData.length > 0) {
      insertBatchIntoDatabase([...transformedData]);
    }
    console.log(`Total rows processed: ${rowCount}`);
    console.log("CSV file processing completed");
  });
