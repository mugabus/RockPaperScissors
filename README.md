🪨📄✂️ Rock Paper Scissors DApp
This project features a fully decentralized Rock Paper Scissors game, bringing the classic hand game to the Ethereum blockchain. Built with Solidity for smart contracts, Hardhat for development and testing, Next.js for a dynamic frontend, and styled with Tailwind CSS, this DApp allows players to engage in fair, on-chain gameplay. Players can create games with secret hashed moves, join with ETH bets, and reveal their moves to determine the winner — all managed securely by a smart contract.

✨ Features
✅ Fully On-Chain Logic: All game rules and state transitions are handled directly on the Ethereum blockchain.
🔒 Commit-Reveal Scheme: Ensures fair play by requiring players to commit a hashed version of their move before revealing it, preventing cheating.
💸 ETH Betting Support: Players can place Ether bets on games, with the winner taking the pot.
🎨 Sleek User Interface: A responsive and visually appealing frontend built with Tailwind CSS.
⚙️ Local Development Environment: Comes with a pre-configured Hardhat setup for easy local development and testing.
🧪 Robust Unit Tests: Comprehensive test suite developed with Hardhat and Chai to ensure contract reliability.
🏗️ Project Structure & Technologies
Smart Contract

The core game logic resides in the Solidity smart contract.

Location: contracts/RockPaperScissors.sol
Key Functions:
createGame(bytes32 _hashedMove): Initializes a new game with a secret hashed move and a bet.
joinGame(uint _gameId, uint8 _move): Allows a second player to join an existing game by placing a bet and committing their move.
revealMove(uint _gameId, uint8 _move, string memory _secret): Enables players to reveal their pre-committed move and secret.
getHashedMove(uint8 _move, string memory _secret): A helper function to generate a hashed move for commitment.
Frontend

The user interface is built as a Next.js application with TypeScript.

Location: frontend/my-project/src/app/page.tsx
Capabilities:
Seamlessly create new games, join existing ones, and reveal your moves.
Connects directly with your MetaMask wallet for blockchain interactions.
Provides real-time updates on game status and interactions.
🚀 Getting Started
Follow these steps to set up and run the Rock Paper Scissors DApp on your local machine.

Prerequisites

Make sure you have the following installed:

Node.js (v18 or higher recommended)
npm (Node Package Manager)
Git
⚙️ Installation

Clone the Repository:

Bash
git clone <repository_url>
cd <repository_name> # Navigate into the cloned repository
 (Replace <repository_url> with the actual URL of your Git repository and <repository_name> with the name of the folder created by cloning.)

Install Dependencies:

Root Directory:
Bash
npm install
Frontend Directory:
Bash

consider the project folder:here is the frontend part plz
npm install
cd ../../ # Go back to the root directory of the DApp
▶️ Running the DApp

To run the DApp, you'll need to start the Hardhat local network, deploy the smart contract, and then launch the frontend application.

Smart Contract (Backend)

Compile the Contracts:

Bash
npx hardhat compile
 Start a Local Hardhat Network:
Open your first terminal and run:

Bash
npx hardhat node
 Keep this terminal open, as it runs your local blockchain.

Deploy the Contract:
Open a new terminal and run:

Bash
npx hardhat ignition deploy ./ignition/modules/RockPaperScissors.ts --network localhost
 This will deploy the smart contract to your local Hardhat network.

Frontend

Navigate to Frontend:
Open another terminal and change into your frontend project directory:

Bash
cd frontend/my-project/
 Start the Development Server:

Bash
npm run dev
 The DApp should now be accessible in your web browser, typically at http://localhost:3000.

🧪 Testing
The project includes a comprehensive suite of unit tests for the smart contract.

Location

test/RockPaperScissors.ts
Run the Test Suite

To execute all tests, run the following command from the project root:

Bash
npx hardhat test
