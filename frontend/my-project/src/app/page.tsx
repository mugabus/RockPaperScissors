// app/page.tsx
"use client";

import { useState } from "react";
import { ethers } from "ethers";
import Card from "./components/Card";
import Button from "./components/Button";
import Input from "./components/Input";
import Label from "./components/Label";

// Replace this with your deployed contract address and ABI
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  "function createGame(bytes32 _hashedMove) external payable",
  "function joinGame(uint _gameId, uint8 _move) external payable",
  "function revealMove(uint _gameId, uint8 _move, string memory _secret) external",
  "function getHashedMove(uint8 _move, string memory _secret) public pure returns (bytes32)"
];

export default function Home() {
  const [secret, setSecret] = useState("");
  const [move, setMove] = useState("0");
  const [bet, setBet] = useState("0.01");
  const [gameId, setGameId] = useState("");
  const [status, setStatus] = useState("");

  async function getProviderAndContract() {
    if (!window.ethereum) throw new Error("Please install MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    return { contract, signer };
  }

  async function handleCreateGame() {
    setStatus("Creating game...");
    const { contract } = await getProviderAndContract();
    const hashedMove = await contract.getHashedMove(parseInt(move), secret);
    const tx = await contract.createGame(hashedMove, {
      value: ethers.parseEther(bet),
    });
    await tx.wait();
    setStatus("Game created. Share your game ID.");
  }

  async function handleJoinGame() {
    setStatus("Joining game...");
    const { contract } = await getProviderAndContract();
    const tx = await contract.joinGame(parseInt(gameId), parseInt(move), {
      value: ethers.parseEther(bet),
    });
    await tx.wait();
    setStatus("Joined game successfully.");
  }

  async function handleRevealMove() {
    setStatus("Revealing move...");
    const { contract } = await getProviderAndContract();
    const tx = await contract.revealMove(parseInt(gameId), parseInt(move), secret);
    await tx.wait();
    setStatus("Move revealed.");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Rock Paper Scissors</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <Label>Move (0: Rock, 1: Paper, 2: Scissors)</Label>
          <Input value={move} onChange={(e) => setMove(e.target.value)} />
          <Label>Secret</Label>
          <Input value={secret} onChange={(e) => setSecret(e.target.value)} />
          <Label>Bet Amount (ETH)</Label>
          <Input value={bet} onChange={(e) => setBet(e.target.value)} />
          <Button onClick={handleCreateGame}>Create Game</Button>
        </Card>

        <Card>
          <Label>Game ID</Label>
          <Input value={gameId} onChange={(e) => setGameId(e.target.value)} />
          <Label>Move (0: Rock, 1: Paper, 2: Scissors)</Label>
          <Input value={move} onChange={(e) => setMove(e.target.value)} />
          <Label>Bet Amount (ETH)</Label>
          <Input value={bet} onChange={(e) => setBet(e.target.value)} />
          <Button onClick={handleJoinGame}>Join Game</Button>
        </Card>

        <Card>
          <Label>Game ID</Label>
          <Input value={gameId} onChange={(e) => setGameId(e.target.value)} />
          <Label>Move</Label>
          <Input value={move} onChange={(e) => setMove(e.target.value)} />
          <Label>Secret</Label>
          <Input value={secret} onChange={(e) => setSecret(e.target.value)} />
          <Button onClick={handleRevealMove}>Reveal Move</Button>
        </Card>
      </div>
      <p className="mt-6 text-lg text-yellow-300 font-semibold">{status}</p>
    </main>
  );
}
