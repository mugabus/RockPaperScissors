import { Move } from './constants';

export interface Game {
  gameId: number;
  player1: string;
  hashedMove: string;
  bet: string;
  player2: string;
  player2Move: Move;
  revealed: boolean;
  finished: boolean;
}

export interface GameWithResult extends Game {
  result?: string;
  winner?: string;
}

export interface CreateGameParams {
  hashedMove: string;
  bet: string;
}

export interface JoinGameParams {
  gameId: number;
  move: Move;
  bet: string;
}

export interface RevealMoveParams {
  gameId: number;
  move: Move;
  secret: string;
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
}