const { sequelize } = require("./server/db.js");
const { Photo } = require("./postgres.js");
const fs = require("fs");
const csv = require("csv-parser");

const batchSize = 1000;
let transformedData = [];
let rowCount = 0;

function transformRow(row) {
  return {
    photo_id: parseInt(row.id, 10),
    review_id: parseInt(row.review_id, 10),
    photo_url: row.url,
  };
}
async function insertBatchIntoDatabase(data) {
  try {
    await Photo.bulkCreate(data, { validate: true });
    console.log(`Inserted batch of ${data.length} rows into the database`);
  } catch (err) {
    console.error("Error inserting batch into database", err);
  }
}

fs.createReadStream("./data/reviews_photos.csv")
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
