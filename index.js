import readline from "readline";
import chalk from "chalk";
import { saveResult, getBestRecordByDifficulty, closeDatabase } from "./db.js";

/* --------------------------
    Helper functions
-----------------------------*/
function createConsoleInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function askQuestion(prompt) {
  const rl = createConsoleInterface();
  return new Promise((resolve) =>
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

/* --------------------------
    Input handlers
-----------------------------*/
async function getDifficultyChoice() {
  while (true) {
    const choice = parseInt(await askQuestion(" Enter your choice: "), 10);
    if ([1, 2, 3].includes(choice)) {
      return choice;
    }
    console.log("\n Invalid choice! Please select 1, 2, or 3.");
  }
}

async function enterGuess() {
  return parseInt(await askQuestion(" Enter your guess: "), 10);
}

async function askPlayAgain() {
  while (true) {
    const answer = (await askQuestion("\n Do you want to play again? [Y/n] "))
      .trim()
      .toLowerCase();
    if (["y", "yes"].includes(answer)) return true;
    if (["n", "no"].includes(answer)) return false;
  }
}

/* --------------------------
    Game logic
-----------------------------*/
async function playLevel(difficultyChoice, secretNumber) {
  let chances;
  let difficultyLabel;

  switch (difficultyChoice) {
    case 1:
      chances = 10;
      difficultyLabel = "Easy";
      break;
    case 2:
      chances = 5;
      difficultyLabel = "Medium";
      break;
    case 3:
      chances = 3;
      difficultyLabel = "Hard";
      break;
  }

  const totalChances = chances;
  console.log(
    `\n Great! You selected ${difficultyLabel} mode.\n You have ${chances} chances.\n Let's start!\n`
  );

  const startTime = Date.now();

  while (chances > 0) {
    chances--;

    const guess = await enterGuess();

    if (isNaN(guess)) {
      console.log(" Invalid input! Please enter a number.\n");
    }
    if (guess > 100 || guess < 1) {
      console.log(" Guess must be between 1 and 100.\n");
    }

    if (guess > secretNumber) {
      console.log(` Incorrect! The number is less than ${guess}.\n`);
    } else if (guess < secretNumber) {
      console.log(` Incorrect! The number is greater than ${guess}.\n`);
    } else {
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      const attemptsUsed = totalChances - chances;

      printWinMessage(attemptsUsed, totalTime);
      saveResult(difficultyLabel, attemptsUsed, totalTime);

      try {
        const bestRecord = await getBestRecordByDifficulty(difficultyLabel);
        const { attempts, time_taken } = bestRecord;

        console.log(
          chalk.green(
            ` Highscore (${difficultyLabel}): ${attempts} attempt${
              attempts !== 1 ? "s" : ""
            }, ${time_taken} second${time_taken !== 1 ? "s" : ""}.`
          )
        );
      } catch (err) {
        console.error("Error: ", err.message);
      }

      return;
    }

    if (chances === Math.floor(totalChances / 3)) {
      printHint(secretNumber);
    }
  }

  console.log(chalk.red(" You lost the game!"));
}

function printWinMessage(attemptsUsed, totalTime) {
  console.log(
    chalk.green(
      `\n Congratulations! You guessed the correct number in ${attemptsUsed} attempt${
        attemptsUsed !== 1 ? "s" : ""
      }, taking ${totalTime} second${totalTime !== 1 ? "s" : ""}.`
    )
  );
}

function printHint(secretNumber) {
  console.log(
    ` Hint: The number is between ${Math.max(
      1,
      secretNumber - Math.trunc(Math.random() * 10) - 3
    )} and ${Math.min(
      100,
      secretNumber + Math.trunc(Math.random() * 10) + 3
    )}, and it's ${secretNumber % 2 === 0 ? "even" : "odd"}.`
  );
}

/* --------------------------
    Main loop
-----------------------------*/
async function playGame() {
  console.log(
    " Welcome to the Number Guessing Game!\n I'm thinking of a number between 1 and 100."
  );
  while (true) {
    const secretNumber = Math.trunc(Math.random() * 100) + 1;

    console.log(
      "\n Please select the difficulty level:\n 1. Easy (10 chances)\n 2. Medium (5 chances)\n 3. Hard (3 chances)\n"
    );

    const difficultyChoice = await getDifficultyChoice();
    await playLevel(difficultyChoice, secretNumber);

    if (!(await askPlayAgain())) break;
  }
  closeDatabase();
}

/* -----------------------------
   Start the game
--------------------------------*/
playGame();
