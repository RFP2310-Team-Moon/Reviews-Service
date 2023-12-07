const fs = require("fs");
const csv = require("csv-parser");
const results = [];

const file1Data = {};
const file2Data = [];

function mergeFiles() {
  if (file1Data && file2Data) {
    const mergedData = [];
    let counter = 0;

    /*
file1
id: { id, product_id, name}

file2
{char_rev_id,characteristic_id,review_id,value}

*/
    for (let i = 0; i < file2Data.length; i++) {
      const current = file2Data[i];
      mergedData.push(
        Object.assign(file1Data[current.characteristic_id], current)
      );
      counter++;
      counter % 100000 === 0 && console.log(counter);
    }

    const mergedCsv = "merged.csv";
    fs.writeFileSync(mergedCsv, "");

    const header = Object.keys(mergedData[0]).join(",") + "\n";
    fs.appendFileSync(mergedCsv, header);

    for (const row of mergedData) {
      const values = Object.values(row).join(",") + "\n";
      fs.appendFileSync(mergedCsv, values);
    }

    console.log("Merged data written to merged.csv");
  }
}
const file2Stream = fs
  .createReadStream("./data/characteristic_reviews.csv")
  .pipe(csv())
  .on("data", (data) => {
    file2Data.push(data);
  })
  .on("end", () => {
    mergeFiles();
  });

const file1Stream = fs
  .createReadStream("./data/characteristics.csv")
  .pipe(csv())
  .on("data", (data) => {
    file1Data[data.id] = data;
  });
