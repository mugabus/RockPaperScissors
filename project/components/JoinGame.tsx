"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Move } from '@/lib/constants';
import { getGame, joinGame } from '@/lib/contract';
import { MoveSelection } from '@/components/MoveSelection';
import { Game } from '@/lib/types';

const formSchema = z.object({
  gameId: z.string().min(1, { message: "Game ID is required" }),
  move: z.nativeEnum(Move, { 
    required_error: "Please select a move",
    invalid_type_error: "Please select a valid move"
  }).refine(move => move !== Move.None, "Please select a move"),
});

type FormValues = z.infer<typeof formSchema>;

export function JoinGame() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [gameDetails, setGameDetails] = useState<Game | null>(null);
  const [isLoadingGame, setIsLoadingGame] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: "",
      move: Move.None,
    },
  });

  const gameId = form.watch("gameId");

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!gameId || isNaN(Number(gameId))) {
        setGameDetails(null);
        return;
      }

      try {
        setIsLoadingGame(true);
        const game = await getGame(Number(gameId));
        setGameDetails(game);
        setError(null);
      } catch (err) {
        setGameDetails(null);
        setError("Failed to load game details");
      } finally {
        setIsLoadingGame(false);
      }
    };

    // Debounce the fetch to avoid too many requests
    const timer = setTimeout(fetchGameDetails, 500);
    return () => clearTimeout(timer);
  }, [gameId]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!gameDetails) {
        throw new Error("Game details not found");
      }
      
      // Join the game
      await joinGame({
        gameId: Number(values.gameId),
        move: values.move,
        bet: gameDetails.bet
      });
      
      setSuccess("You've joined the game successfully!");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join game");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGameJoinable = gameDetails && 
                        gameDetails.player2 === "0x0000000000000000000000000000000000000000" && 
                        !gameDetails.finished;

  return (
    <Card className="w-full border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Join a Game</CardTitle>
        <CardDescription>
          Join an existing Rock-Paper-Scissors game by entering the game ID.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="gameId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game ID</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" />
                  </FormControl>
                  <FormDescription>
                    Enter the ID of the game you want to join.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isLoadingGame && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            
            {gameDetails && !isLoadingGame && (
              <div className="p-4 bg-muted/50 rounded-md border border-border">
                <h4 className="font-medium">Game Details</h4>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt>Created by:</dt>
                    <dd className="font-mono">{gameDetails.player1.substring(0, 10)}...</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Bet Amount:</dt>
                    <dd>{gameDetails.bet} ETH</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Status:</dt>
                    <dd>
                      {isGameJoinable ? (
                        <span className="text-green-500">Open to join</span>
                      ) : (
                        <span className="text-red-500">Not available</span>
                      )}
                    </dd>
                  </div>
                </dl>
                
                {!isGameJoinable && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>
                      This game is not available to join. It may already have a second player or be finished.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            
            <FormField
              control={form.control}
              name="move"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select Your Move</FormLabel>
                  <FormControl>
                    <MoveSelection 
                      selectedMove={field.value} 
                      onSelectMove={(move) => field.onChange(move)}
                      disabled={!isGameJoinable} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              disabled={isSubmitting || !isGameJoinable} 
              className="w-full bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining Game...
                </>
              ) : (
                "Join Game"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}