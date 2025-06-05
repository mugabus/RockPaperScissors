# 🪨📄✂️ Rock Paper Scissors DApp

This is a decentralized Rock Paper Scissors game built on Ethereum using **Solidity**, **Hardhat**, **Next.js**, and **Tailwind CSS**. Players can create games with secret hashed moves, join with bets, and reveal their moves to determine the winner — all handled by a smart contract.

## ✨ Features

- ✅ Fully on-chain Rock Paper Scissors logic
- 🔒 Commit-reveal scheme using secret-hashed moves
- 💸 ETH betting support
- 🎨 Beautiful UI with TailwindCSS
- ⚙️ Local Hardhat development environment
- 🧪 Unit tests with Hardhat and Chai

---

## 🧱 Smart Contract

### Location
- `contracts/RockPaperScissors.sol`

### Core Functions

- `createGame(bytes32 _hashedMove)`: Start a new game
- `joinGame(uint _gameId, uint8 _move)`: Join an existing game
- `revealMove(uint _gameId, uint8 _move, string memory _secret)`: Reveal your move
- `getHashedMove(uint8 _move, string memory _secret)`: Helper to hash a move+secret

### Supported Moves
| Move      | Value |
|-----------|-------|
| Rock      | 0     |
| Paper     | 1     |
| Scissors  | 2     |

---

## 🖥 Frontend

### Location
- `app/page.tsx`

### Features
- Create game with hashed move
- Join existing game with ETH bet
- Reveal move to conclude the game
- Real-time feedback and status messages

---

## 🧪 Testing

### Location
- `test/RockPaperScissors.ts`

Run the test suite:

```bash
npx hardhat test
