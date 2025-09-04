# Number Guessing Game 🎯

A simple command-line number guessing game built with **Node.js**, inspired by the [roadmap.sh challenge](https://roadmap.sh/projects/number-guessing-game).

## 📖 Description

The computer randomly selects a number between **1 and 100**, and your goal is to guess it.  
You can choose between three difficulty levels, each affecting the number of attempts you have.

Features:

- Random number generation between 1 and 100.
- Difficulty selection (**Easy, Medium, Hard**).
- Hints after incorrect guesses.
- Tracks highscores (fewest attempts / fastest time).
- Option to play again or quit after each round.

## 🛠 Tech Stack

- [Node.js](https://nodejs.org/) (v14+ recommended)
- Built-in `readline` module for user input
- [`chalk`](https://www.npmjs.com/package/chalk) for colorful CLI output
- [`sqlite3`](https://www.npmjs.com/package/sqlite3) for saving highscores

## 🚀 Installation & Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/Number-Guessing-Game.git
   cd Number-Guessing-Game
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the game:
   ```bash
   node index.js
   ```

## 🎮 How to Play

1. Select difficulty:
   - **Easy** → 10 attempts
   - **Medium** → 5 attempts
   - **Hard** → 3 attempts
2. Enter a guess between **1 and 100**.
3. Get hints if the guess is too high or too low.
4. Beat the highscore in attempts or time to set a new record!

## 📂 Project Structure

```
.
├── index.js        # Main entry point
├── db.js           # Database handling
├── package.json
└── README.md
```

## 🧑‍💻 Author

- [me, bro](https://github.com/levanvux)

## 🙏 Acknowledgments

- [roadmap.sh](https://roadmap.sh) for the project idea
- Node.js community & open-source libraries
