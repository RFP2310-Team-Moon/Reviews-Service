const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("fast-csv").write;

const inputFilePath = "./data/review_test.csv"; // Replace with your input file
const outputFilePath = "./data/review_clean.csv"; // Replace with your output file

const cleanedData = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", (row) => {
    const transformedDate = new Date(Number(row.date)).toLocaleString();

    const transformed = {
      review_id: parseInt(row.review_id, 10),
      rating: row.rating,
      createdAt: transformedDate,
      summary: row.summary,
      body: row.body,
      recommend: row.recommended,
      reviewer_name: row.name,
      reviewer_email: row.email,
    };
    cleanedData.push(transformed);
    console.log(cleanedData);
  })
  .on("end", () => {
    // Write the cleaned data to a new CSV file
    const csvWriter = createCsvWriter({ headers: true });
    const outputStream = fs.createWriteStream(outputFilePath);

    csvWriter.pipe(outputStream);
    cleanedData.forEach((data) => csvWriter.write(data));
    csvWriter.end();
    console.log(`Cleaned data saved to '${outputFilePath}'.`);
  });
