"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, RefreshCw } from 'lucide-react';
import { getAllGames } from '@/lib/contract';
import { Game } from '@/lib/types';
import { formatAddress } from '@/lib/utils';
import { Move, MOVE_NAMES } from '@/lib/constants';
import { useWallet } from '@/hooks/useWallet';

export function GameList() {
  const { address } = useWallet();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allGames = await getAllGames();
      // Sort games: active first, then by ID (descending)
      const sortedGames = allGames.sort((a, b) => {
        // First by status (unfinished first)
        if (a.finished !== b.finished) {
          return a.finished ? 1 : -1;
        }
        // Then by ID (latest first)
        return b.gameId - a.gameId;
      });
      setGames(sortedGames);
    } catch (err) {
      setError("Failed to load games");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const getGameStatus = (game: Game) => {
    if (game.finished) {
      return { status: "Finished", color: "text-red-500" };
    }
    if (game.revealed) {
      return { status: "Revealed", color: "text-green-500" };
    }
    if (game.player2 === "0x0000000000000000000000000000000000000000") {
      return { status: "Waiting for Player 2", color: "text-yellow-500" };
    }
    return { status: "Ready to Reveal", color: "text-blue-500" };
  };

  const isUserGame = (game: Game) => {
    if (!address) return false;
    return (
      game.player1.toLowerCase() === address.toLowerCase() || 
      game.player2.toLowerCase() === address.toLowerCase()
    );
  };

  const filteredGames = games.filter(game => {
    // If player2 is empty address, it should still be shown as an available game
    return game.player2 !== "0x0000000000000000000000000000000000000000" || !game.finished;
  });

  return (
    <Card className="w-full border-primary/20 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl">Game List</CardTitle>
          <CardDescription>
            View all available and past Rock-Paper-Scissors games.
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={fetchGames} 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-4 text-destructive">{error}</div>
        ) : isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No games available. Create one to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Player 1</TableHead>
                  <TableHead>Player 2</TableHead>
                  <TableHead className="text-right">Bet (ETH)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.map((game) => {
                  const { status, color } = getGameStatus(game);
                  const userGame = isUserGame(game);
                  
                  return (
                    <TableRow key={game.gameId} className={userGame ? "bg-primary/5" : ""}>
                      <TableCell className="font-medium">{game.gameId}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatAddress(game.player1)}
                        {address && game.player1.toLowerCase() === address.toLowerCase() && (
                          <span className="ml-1 text-primary">(You)</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {game.player2 === "0x0000000000000000000000000000000000000000" 
                          ? "-" 
                          : (
                            <>
                              {formatAddress(game.player2)}
                              {address && game.player2.toLowerCase() === address.toLowerCase() && (
                                <span className="ml-1 text-primary">(You)</span>
                              )}
                            </>
                          )
                        }
                      </TableCell>
                      <TableCell className="text-right">{game.bet}</TableCell>
                      <TableCell className={color}>{status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}