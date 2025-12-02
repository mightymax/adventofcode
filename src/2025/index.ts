
/**
 * @see https://adventofcode.com/2025/day/1
 */

import chalk from "chalk";
import fs from "fs/promises";
type Rotation = {
  steps: number;
  direction: "L" | "R";
}

const startPosition = 50;
const positions = 100 // 0 to 99
let numberOfTimesWePassedPositionZero = 0;
let numberOfTimesWeLandendOnPositionZero = 0;

console.log(chalk.blue.bold("--- Day 1: Secret Entrance ---"));
const file = process.env.ENV === "test" ? "static/2025/day1.test.txt" : "static/2025/day1.input.txt";
const answer = await fs.readFile(file, "utf-8")
  .then((text: string) => {
    const rotations: Rotation[] =
      text
        .trim()
        .split("\n")
        .map((line) => {
          const [dir, stepsStr] = line.split(/^(L|R)(\d+)$/).filter(Boolean);
          if (!dir || !stepsStr) {
            throw new Error(`Invalid line: ${line}`);
          }
          return {
            direction: dir as "L" | "R",
            steps: parseInt(stepsStr, 10),
          }
        })
    console.log(`  - The dial starts by pointing at ${startPosition}.`)
    let currentPosition = startPosition;

    for (const rotation of rotations) {
      let passedZeroThisRotation = 0;
      for (let step = 1; step <= rotation.steps; step++) {
        if (rotation.direction === "L") {
          currentPosition = (currentPosition - 1 + positions) % positions;
        } else {
          currentPosition = (currentPosition + 1) % positions;
        }

        // Check if we passed through 0
        if (currentPosition === 0) {
          numberOfTimesWePassedPositionZero++;
          passedZeroThisRotation++;
        }
      }
      console.log(`  - The dial is rotated ${chalk.italic(rotation.direction + rotation.steps)} to point at ${currentPosition}${passedZeroThisRotation > 0 ? ` during this rotation, it points at 0 ${passedZeroThisRotation === 1 ? chalk.bold("once") : passedZeroThisRotation + " times"}` : ""}.`);
      if (currentPosition === 0) {
        numberOfTimesWeLandendOnPositionZero++;
      }

    }

    return {
      partOne: numberOfTimesWeLandendOnPositionZero,
      partTwo: numberOfTimesWePassedPositionZero
    };
  });


console.log(chalk.yellow.bold(`Answer: \n  - We passed position 0 ${chalk.bold(answer.partTwo)} times\n  - We landed on position 0 ${chalk.bold(answer.partOne)} times`));

if (process.env.ENV === "test") {
  let error = false;
  if (answer.partOne !== 3) {
    console.error(chalk.red.bold(`Test failed for part 1: expected 3 but got ${answer.partOne}`));
    error = true;
  }
  if (answer.partTwo !== 6) {
    console.error(chalk.red.bold(`Test failed for part 2: should have passed 0 6 times but got ${answer.partTwo}`));
    error = true;
  }
  if (!error) {
    console.log(chalk.green.bold("Test passed."));
  }
}