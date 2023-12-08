const { sequelize } = require("../server/db.js");
const { Characteristic } = require("../postgres.js");
const fs = require("fs");
const csv = require("csv-parser");

const batchSize = 1000;
let transformedData = [];
let rowCount = 0;

function transformRow(row) {
  return {
    review_id: parseInt(row.review_id, 10),
    product_id: parseInt(row.product_id, 10),
    size: row.size,
    fit: row.fit,
    length: row.length,
    width: row.width,
    comfort: row.comfort,
    quality: row.quality,
  };
}
async function insertBatchIntoDatabase(data) {
  try {
    await Characteristic.bulkCreate(data, { validate: true });
    console.log(`Inserted batch of ${data.length} rows into the database`);
  } catch (err) {
    console.error("Error inserting batch into database", err);
  }
}

fs.createReadStream("test.csv")
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
    // Insert remaining data (if any)
    if (transformedData.length > 0) {
      insertBatchIntoDatabase([...transformedData]); // Insert a copy of the remaining data
    }
    console.log(`Total rows processed: ${rowCount}`);
    console.log("CSV file processing completed");
  });
