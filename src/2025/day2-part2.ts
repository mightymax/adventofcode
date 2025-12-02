import chalk from "chalk";

const myInput = '492410748-492568208,246-390,49-90,16-33,142410-276301,54304-107961,12792-24543,3434259704-3434457648,848156-886303,152-223,1303-1870,8400386-8519049,89742532-89811632,535853-567216,6608885-6724046,1985013826-1985207678,585591-731454,1-13,12067202-12233567,6533-10235,6259999-6321337,908315-972306,831-1296,406-824,769293-785465,3862-5652,26439-45395,95-136,747698990-747770821,984992-1022864,34-47,360832-469125,277865-333851,2281-3344,2841977-2953689,29330524-29523460'
const testInput = '11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124'

const input = process.env.ENV === "test" ? testInput : myInput;

type Range = {
  start: number;
  end: number;
}

console.log(chalk.blue.bold("--- Day 2: Gift Shop ---"));
console.log("Part 2: Checking for repeated digit sequences...");
const ranges: Range[] = input.split(",").map(range => {
  const [start, end] = range.split("-");
  return {
    start: parseInt(start),
    end: parseInt(end),
  }
})

const invalidIds: number[] = [];

for (const range of ranges) {
  for (let id = range.start; id <= range.end; id++) {
    const idStr = id.toString();
    
    // Check all possible pattern lengths from 1 to half the string length
    for (let patternLength = 1; patternLength <= Math.floor(idStr.length / 2); patternLength++) {
      const pattern = idStr.substring(0, patternLength);
      
      // Check if the entire string is made of this pattern repeated
      let isRepeated = true;
      for (let i = 0; i < idStr.length; i += patternLength) {
        const chunk = idStr.substring(i, i + patternLength);
        if (chunk !== pattern && i + patternLength <= idStr.length) {
          isRepeated = false;
          break;
        }
        // Handle partial chunk at the end
        if (i + patternLength > idStr.length && chunk !== pattern.substring(0, chunk.length)) {
          isRepeated = false;
          break;
        }
      }
      
      // If pattern repeats at least twice and covers the whole string
      if (isRepeated && idStr.length >= patternLength * 2 && idStr.length % patternLength === 0) {
        invalidIds.push(id);
        break; // Found a repeating pattern, no need to check other lengths
      }
    }
  }
}

console.log(`  - Found ${invalidIds.length} invalid IDs.`);
const sumOfInvalidIds = invalidIds.reduce((sum, id) => sum + id, 0);
console.log(`  - The sum of all invalid IDs is ${chalk.bold(sumOfInvalidIds)}`);

if (process.env.ENV === "test") {
  if (sumOfInvalidIds === 4174379265) {
    console.log(chalk.green.bold("  - Test passed!"));
  } else {
    console.log(chalk.red.bold(`  - Test failed! Expected 1227775554 but got ${sumOfInvalidIds}`));
  }
}