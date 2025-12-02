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
let countPosition0 = 0
const positions = 100

const file = process.env.ENV === "test" ? "static/2025/day1.test.txt" : "static/2025/day1.input.txt";
// await fs.readFile("static/2025/day1.input.txt", "utf-8")
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
      const stepChange = rotation.direction === "L" ? -rotation.steps : rotation.steps;
      currentPosition = (currentPosition + stepChange + positions) % positions;
      if (currentPosition === 0) {
        countPosition0 += 1;
      }
      console.log(`  - The dial is rotated ${chalk.bold(rotation.direction + rotation.steps)} to point at ${currentPosition === 0 ? chalk.yellow.bold(currentPosition) : currentPosition}.`)
    }
    console.log(chalk.cyan.bold(`  - Final position: ${currentPosition}`));
    console.log(chalk.cyan.bold(`  - Times at position 0: ${countPosition0}`));
    return countPosition0
  });

console.log(chalk.yellow.bold(`Answer: ${answer}`));

if (process.env.ENV === "test") {
  if (answer !== 3) {
    console.error(chalk.red.bold(`Test failed: expected 3 but got ${answer}`));
  } else {
    console.log(chalk.green.bold("Test passed."));
  }
}