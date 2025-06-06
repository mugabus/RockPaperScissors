import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MOVE_ICONS, Move } from "@/lib/constants";

export default function HowToPlay() {
  return (
    <div className="container max-w-screen-xl py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            How to Play Rock Paper Scissors
          </h1>
          <p className="mt-4 text-muted-foreground">
            Learn how to play the blockchain version of the classic Rock Paper Scissors game.
          </p>
        </div>
        
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Game Rules</CardTitle>
            <CardDescription>
              The classic game with blockchain betting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Basic Rules</h3>
              <p className="text-muted-foreground">
                Rock Paper Scissors is a game of chance where:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>{MOVE_ICONS[Move.Rock]} Rock crushes Scissors</li>
                <li>{MOVE_ICONS[Move.Paper]} Paper covers Rock</li>
                <li>{MOVE_ICONS[Move.Scissors]} Scissors cuts Paper</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Step 1: Create a Game</h3>
              <p className="text-muted-foreground">
                As Player 1, you create a game by:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Connecting your Ethereum wallet</li>
                <li>Selecting your move (Rock, Paper, or Scissors)</li>
                <li>Setting a bet amount in ETH</li>
                <li>Confirming the transaction</li>
              </ol>
              <p className="mt-2 text-muted-foreground">
                <strong>Important:</strong> You'll receive a secret key. Save it! You'll need this to reveal your move later.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Step 2: Join a Game</h3>
              <p className="text-muted-foreground">
                As Player 2, you can join an existing game by:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Entering the Game ID of an open game</li>
                <li>Selecting your move</li>
                <li>Matching the bet amount in ETH</li>
                <li>Confirming the transaction</li>
              </ol>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Step 3: Reveal the Move</h3>
              <p className="text-muted-foreground">
                After Player 2 joins, Player 1 must reveal their move:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Enter the Game ID</li>
                <li>Select the move you originally chose</li>
                <li>Enter your secret key from Step 1</li>
                <li>Confirm the transaction</li>
              </ol>
              <p className="mt-2 text-muted-foreground">
                The smart contract will verify your move matches your original commitment, determine the winner, and distribute the funds accordingly.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-2">Payouts</h3>
              <p className="text-muted-foreground">
                The payout structure is as follows:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li><strong>Win:</strong> Receive 90% of the total pot (your bet + opponent's bet)</li>
                <li><strong>Draw:</strong> Both players get their original bet back</li>
                <li><strong>Platform Fee:</strong> 10% of the total pot goes to the platform</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Security Model</CardTitle>
            <CardDescription>
              How the blockchain ensures fair play
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The Rock Paper Scissors game uses a commit-reveal scheme to ensure fairness:
            </p>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Commit Phase</h3>
              <p className="text-muted-foreground">
                Player 1 doesn't reveal their move immediately. Instead, they submit a cryptographic hash of their move combined with a secret. This ensures Player 2 cannot know Player 1's move when making their own choice.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Reveal Phase</h3>
              <p className="text-muted-foreground">
                After Player 2 commits their move, Player 1 reveals both their original move and the secret. The smart contract verifies that the hash of these values matches the original commitment, ensuring Player 1 cannot change their move after seeing Player 2's choice.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md border border-border mt-4">
              <h4 className="font-medium mb-2">Technical Note</h4>
              <p className="text-sm text-muted-foreground">
                All game logic and fund management is handled by a smart contract on the Ethereum blockchain. This provides transparency, security, and eliminates the need for a trusted third party.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}