const fs = require("fs");
const csv = require("csv-parser");

const file1Data = {};

function transformFile() {
  if (file1Data) {
    const mergedData = [];
    for (const productID in file1Data) {
      for (const reviewID in file1Data[productID]) {
        console.log(file1Data[productID][reviewID]);
        const current = file1Data[productID][reviewID];
        mergedData.push({
          product_id: productID,
          review_id: reviewID,
          size: current.Size ? current.Size.value : null,
          // size_id: current.Size ? current.Size.characteristic_id : "null",
          fit: current.Fit ? current.Fit.value : null,
          // fit_id: current.Fit ? current.Fit.characteristic_id : "null",
          length: current.Length ? current.Length.value : null,
          // length_id: current.Length ? current.Length.characteristic_id : "null",
          width: current.Width ? current.Width.value : null,
          // width_id: current.Width ? current.Width.characteristic_id : "null",
          comfort: current.Comfort ? current.Comfort.value : null,
          // comfort_id: current.Comfort
          // ? current.Comfort.characteristic_id
          // : "null",
          quality: current.Quality ? current.Quality.value : null,
          // quality_id: current.Quality
          // ? current.Quality.characteristic_id
          // : "null",
        });
      }
    }

    const mergedCsv = "final.csv";
    fs.writeFileSync(mergedCsv, "");

    const header = `${Object.keys(mergedData[0]).join(",")}\n`;
    fs.appendFileSync(mergedCsv, header);

    for (const row of mergedData) {
      const values = `${Object.values(row).join(",")}\n`;
      fs.appendFileSync(mergedCsv, values);
    }

    console.log("Merged data written to final.csv");
  }
}
const file1Stream = fs
  .createReadStream("etl/characteristics_merged.csv")
  .pipe(csv())
  .on("data", (data) => {
    const obj = {
      characteristic_id: data.characteristic_id,
      value: data.value,
    };

    if (!file1Data[data.product_id]) {
      file1Data[data.product_id] = {};
      file1Data[data.product_id][data.review_id] = {};
    } else if (!file1Data[data.product_id][data.review_id]) {
      file1Data[data.product_id][data.review_id] = {};
    }
    file1Data[data.product_id][data.review_id][data.name] = obj;
  })
  .on("end", () => {
    transformFile();
  });
