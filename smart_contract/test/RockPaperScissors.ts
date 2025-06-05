import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { keccak256, toUtf8Bytes } from "ethers";

describe("RockPaperScissors", function () {
  enum Move {
    None,
    Rock,
    Paper,
    Scissors,
  }

  async function deployGameFixture() {
    const [owner, player1, player2] = await ethers.getSigners();
    const RPS = await ethers.getContractFactory("RockPaperScissors");
    const rps = await RPS.deploy();

    return { rps, owner, player1, player2 };
  }

  it("Should allow player1 to create a game", async function () {
    const { rps, player1 } = await loadFixture(deployGameFixture);

    const move = Move.Rock;
    const secret = "abc123";
    const hashedMove = keccak256(ethers.solidityPacked(["uint8", "string"], [move, secret]));

    await expect(
      rps.connect(player1).createGame(hashedMove, { value: ethers.parseEther("1") })
    ).to.emit(rps, "GameCreated");
  });

  it("Should allow player2 to join the game with a valid move and same bet", async function () {
    const { rps, player1, player2 } = await loadFixture(deployGameFixture);

    const move = Move.Paper;
    const secret = "abc123";
    const hashedMove = keccak256(ethers.solidityPacked(["uint8", "string"], [move, secret]));

    await rps.connect(player1).createGame(hashedMove, { value: ethers.parseEther("1") });

    await expect(
      rps.connect(player2).joinGame(0, Move.Scissors, { value: ethers.parseEther("1") })
    ).to.emit(rps, "Player2Joined");
  });

  it("Should resolve to a draw if both players play the same move", async function () {
    const { rps, player1, player2 } = await loadFixture(deployGameFixture);

    const move = Move.Rock;
    const secret = "drawtest";
    const hashedMove = keccak256(ethers.solidityPacked(["uint8", "string"], [move, secret]));

    await rps.connect(player1).createGame(hashedMove, { value: ethers.parseEther("1") });
    await rps.connect(player2).joinGame(0, Move.Rock, { value: ethers.parseEther("1") });

    const before1 = await ethers.provider.getBalance(player1.address);
    const before2 = await ethers.provider.getBalance(player2.address);

    const tx = await rps.connect(player1).revealMove(0, Move.Rock, secret);
    await expect(tx).to.emit(rps, "GameRevealed").withArgs(0, "Draw", ethers.ZeroAddress);

    const after1 = await ethers.provider.getBalance(player1.address);
    const after2 = await ethers.provider.getBalance(player2.address);

    expect(after1).to.be.gt(before1); // Player1 got refund
    expect(after2).to.be.gt(before2); // Player2 got refund
  });

  it("Should reward player1 if they win and pay 10% to the owner", async function () {
    const { rps, owner, player1, player2 } = await loadFixture(deployGameFixture);

    const move = Move.Rock;
    const secret = "winsecret";
    const hashedMove = keccak256(ethers.solidityPacked(["uint8", "string"], [move, secret]));

    await rps.connect(player1).createGame(hashedMove, { value: ethers.parseEther("1") });
    await rps.connect(player2).joinGame(0, Move.Scissors, { value: ethers.parseEther("1") });

    const balanceBeforeWinner = await ethers.provider.getBalance(player1.address);
    const balanceBeforeOwner = await ethers.provider.getBalance(owner.address);

    const tx = await rps.connect(player1).revealMove(0, Move.Rock, secret);
    await tx.wait();

    const balanceAfterWinner = await ethers.provider.getBalance(player1.address);
    const balanceAfterOwner = await ethers.provider.getBalance(owner.address);

    expect(balanceAfterWinner).to.be.gt(balanceBeforeWinner); // player1 gains
    expect(balanceAfterOwner).to.be.gt(balanceBeforeOwner);   // owner gets 10%
  });

  it("Should reward player2 if they win and pay 10% to the owner", async function () {
    const { rps, owner, player1, player2 } = await loadFixture(deployGameFixture);

    const move = Move.Scissors;
    const secret = "loseSecret";
    const hashedMove = keccak256(ethers.solidityPacked(["uint8", "string"], [move, secret]));

    await rps.connect(player1).createGame(hashedMove, { value: ethers.parseEther("1") });
    await rps.connect(player2).joinGame(0, Move.Rock, { value: ethers.parseEther("1") });

    const balanceBeforeWinner = await ethers.provider.getBalance(player2.address);
    const balanceBeforeOwner = await ethers.provider.getBalance(owner.address);

    const tx = await rps.connect(player1).revealMove(0, Move.Scissors, secret);
    await tx.wait();

    const balanceAfterWinner = await ethers.provider.getBalance(player2.address);
    const balanceAfterOwner = await ethers.provider.getBalance(owner.address);

    expect(balanceAfterWinner).to.be.gt(balanceBeforeWinner); // player2 gains
    expect(balanceAfterOwner).to.be.gt(balanceBeforeOwner);   // owner gets 10%
  });
});
