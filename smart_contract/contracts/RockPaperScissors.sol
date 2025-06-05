// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RockPaperScissors {
    enum Move { None, Rock, Paper, Scissors }

    struct Game {
        address payable player1;
        bytes32 hashedMove;
        uint bet;
        address payable player2;
        Move player2Move;
        bool revealed;
        bool finished;
    }

    address payable public owner;
    mapping(uint => Game) public games;
    uint public gameId;

    event GameCreated(uint indexed gameId, address indexed player1, uint bet);
    event Player2Joined(uint indexed gameId, address indexed player2);
    event GameRevealed(uint indexed gameId, string result, address winner);

    constructor() {
        owner = payable(msg.sender);
    }

    function createGame(bytes32 _hashedMove) external payable {
        require(msg.value > 0, "Bet required");
        games[gameId] = Game(
            payable(msg.sender), 
            _hashedMove,
            msg.value, 
            payable(address(0)), 
            Move.None,
            false, 
            false
        );
        emit GameCreated(gameId, msg.sender, msg.value);
        gameId++;
    }

    function joinGame(uint _gameId, Move _move) external payable {
        Game storage g = games[_gameId];
        require(g.player1 != address(0), "Game doesn't exist");
        require(g.player2 == address(0), "Game already has 2 players");
        require(msg.value == g.bet, "Bet must match");
        require(_move == Move.Rock || _move == Move.Paper || _move == Move.Scissors, "Invalid move");

        g.player2 = payable(msg.sender);
        g.player2Move = _move;
        emit Player2Joined(_gameId, msg.sender);
    }

    function revealMove(uint _gameId, Move _move, string memory _secret) external {
        Game storage g = games[_gameId];
        require(msg.sender == g.player1, "Only player 1 can reveal");
        require(!g.revealed, "Already revealed");
        require(g.player2 != address(0), "No opponent yet");
        require(keccak256(abi.encodePacked(_move, _secret)) == g.hashedMove, "Invalid move or secret");

        g.revealed = true;
        g.finished = true;

        string memory result;
        address winner = address(0);
        uint totalPot = 2 * g.bet;
        uint ownerCut = totalPot / 10;
        uint winnerReward = totalPot - ownerCut;

        // Determine winner
        if (_move == g.player2Move) {
            result = "Draw";
            g.player1.transfer(g.bet);
            g.player2.transfer(g.bet);
        } else if (
            (_move == Move.Rock && g.player2Move == Move.Scissors) ||
            (_move == Move.Paper && g.player2Move == Move.Rock) ||
            (_move == Move.Scissors && g.player2Move == Move.Paper)
        ) {
            result = "Player 1 wins";
            g.player1.transfer(winnerReward);
            winner = g.player1;
            owner.transfer(ownerCut);
        } else {
            result = "Player 2 wins";
            g.player2.transfer(winnerReward);
            winner = g.player2;
            owner.transfer(ownerCut);
        }

        emit GameRevealed(_gameId, result, winner);
    }

    // Utility function to get the hash for a move + secret
    function getHashedMove(Move _move, string memory _secret) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(_move, _secret));
    }
}
