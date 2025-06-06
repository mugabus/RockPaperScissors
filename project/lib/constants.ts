export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address

export enum Move {
  None = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3
}

export const MOVE_NAMES = {
  [Move.None]: "None",
  [Move.Rock]: "Rock",
  [Move.Paper]: "Paper",
  [Move.Scissors]: "Scissors"
};

export const MOVE_ICONS = {
  [Move.Rock]: "✊",
  [Move.Paper]: "✋",
  [Move.Scissors]: "✌️"
};

export const getEmoji = (move: Move): string => {
  return MOVE_ICONS[move] || "❓";
};