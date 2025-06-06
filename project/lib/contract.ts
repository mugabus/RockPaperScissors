import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, Move } from './constants';
import { CreateGameParams, JoinGameParams, RevealMoveParams, Game } from './types';

const contractABI = [
  "function createGame(bytes32 _hashedMove) external payable",
  "function joinGame(uint _gameId, uint8 _move) external payable",
  "function revealMove(uint _gameId, uint8 _move, string memory _secret) external",
  "function getHashedMove(uint8 _move, string memory _secret) external pure returns (bytes32)",
  "function games(uint) view returns (address payable player1, bytes32 hashedMove, uint bet, address payable player2, uint8 player2Move, bool revealed, bool finished)",
  "function gameId() view returns (uint)"
];

export async function getContract(signer?: ethers.Signer) {
  if (!window.ethereum) throw new Error("No Ethereum wallet detected");
  
  // For read-only operations (no signer needed)
  if (!signer) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
  }
  
  // For write operations (signer needed)
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
}

export async function createGame({ hashedMove, bet }: CreateGameParams) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = await getContract(signer);
    
    const tx = await contract.createGame(hashedMove, {
      value: ethers.parseEther(bet)
    });
    
    return await tx.wait();
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
}

export async function joinGame({ gameId, move, bet }: JoinGameParams) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = await getContract(signer);
    
    const tx = await contract.joinGame(gameId, move, {
      value: ethers.parseEther(bet)
    });
    
    return await tx.wait();
  } catch (error) {
    console.error("Error joining game:", error);
    throw error;
  }
}

export async function revealMove({ gameId, move, secret }: RevealMoveParams) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = await getContract(signer);
    
    const tx = await contract.revealMove(gameId, move, secret);
    return await tx.wait();
  } catch (error) {
    console.error("Error revealing move:", error);
    throw error;
  }
}

export async function getHashedMove(move: Move, secret: string) {
  try {
    const contract = await getContract();
    return await contract.getHashedMove(move, secret);
  } catch (error) {
    console.error("Error hashing move:", error);
    throw error;
  }
}

export async function getGame(gameId: number): Promise<Game> {
  try {
    const contract = await getContract();
    const game = await contract.games(gameId);
    
    return {
      gameId,
      player1: game.player1,
      hashedMove: game.hashedMove,
      bet: ethers.formatEther(game.bet),
      player2: game.player2,
      player2Move: game.player2Move,
      revealed: game.revealed,
      finished: game.finished
    };
  } catch (error) {
    console.error("Error getting game:", error);
    throw error;
  }
}

export async function getCurrentGameId(): Promise<number> {
  try {
    const contract = await getContract();
    const gameId = await contract.gameId();
    return Number(gameId);
  } catch (error) {
    console.error("Error getting current game ID:", error);
    throw error;
  }
}

export async function getAllGames(): Promise<Game[]> {
  try {
    const currentGameId = await getCurrentGameId();
    const games: Game[] = [];
    
    for (let i = 0; i < currentGameId; i++) {
      try {
        const game = await getGame(i);
        games.push(game);
      } catch (error) {
        console.error(`Error getting game ${i}:`, error);
      }
    }
    
    return games;
  } catch (error) {
    console.error("Error getting all games:", error);
    throw error;
  }
}