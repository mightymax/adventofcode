
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
const positions = 100
let countPosition0 = 0
let passedPosition0Count = 0;

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
      // Count how many times we pass through position 0 during the rotation
      let hasPast0Count= 0;
      for (let step = 1; step < rotation.steps; step++) {
        const intermediatePosition = (currentPosition + (rotation.direction === "L" ? -step : step) + positions) % positions;
        if (intermediatePosition === 0) {
          passedPosition0Count += 1;
          hasPast0Count++
        }
      }
      currentPosition = (currentPosition + (rotation.direction === "L" ? -rotation.steps : rotation.steps) + positions) % positions;
      console.log(`  - The dial is rotated ${chalk.bold(rotation.direction + rotation.steps)} to point at ${currentPosition === 0 ? chalk.yellow.bold(currentPosition) : currentPosition}${hasPast0Count > 0 ? `; during this rotation, it points at 0 ${hasPast0Count > 1 ? "times" : "once"}` : ""}.`)
      if (currentPosition === 0 && hasPast0Count === 0)  passedPosition0Count++
      if (currentPosition === 0)  countPosition0++
    }
    console.log(chalk.cyan.bold(`  - Final position: ${currentPosition}`));
    console.log(chalk.cyan.bold(`  - Times at position 0: ${countPosition0}`));
    console.log(chalk.cyan.bold(`  - Number of times passed position 0: ${passedPosition0Count}`));
    return {day2: passedPosition0Count, day1: countPosition0}
  });

console.log(chalk.yellow.bold(`Answer: \n  - day1: ${answer.day1}\n  - day2: ${answer.day2}`));

if (process.env.ENV === "test") {
  let error = false;
  if (answer.day1 !== 3) {
    console.error(chalk.red.bold(`Test failed for day 1: expected 3 but got ${answer.day1}`));
    error = true;
  }
  if (answer.day2 !== 6) {
    console.error(chalk.red.bold(`Test failed for day 2: should have passed 0 6 times but got ${answer.day2}`));
    error = true;
  }
  if (!error) {
    console.log(chalk.green.bold("Test passed."));
  }
}