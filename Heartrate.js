const fs = require("fs");

const rawData = fs.readFileSync("heartrate.json", "utf8");
const heartRateData = JSON.parse(rawData);

function calculateMedian(arr) {
  const sortedArr = arr.sort((a, b) => a - b);
  const mid = Math.floor(sortedArr.length / 2);
  return sortedArr.length % 2 !== 0
    ? sortedArr[mid]
    : (sortedArr[mid - 1] + sortedArr[mid]) / 2;
}

const processedData = heartRateData.map((day) => {
  const beatsPerMinute = day.measurements.map(
    (measurement) => measurement.beatsPerMinute
  );
  const latestDataTimestamp = new Date(
    Math.max(
      ...day.measurements.map((measurement) =>
        new Date(measurement.endTimestamp).getTime()
      )
    )
  ).toISOString();

  return {
    date: day.date,
    min: Math.min(...beatsPerMinute),
    max: Math.max(...beatsPerMinute),
    median: calculateMedian(beatsPerMinute),
    latestDataTimestamp,
  };
});

const outputFileName = "output.json";
fs.writeFileSync(outputFileName, JSON.stringify(processedData, null, 2));

console.log(`Output has been written to ${outputFileName}`);
