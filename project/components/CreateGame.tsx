"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Move } from '@/lib/constants';
import { generateSecret } from '@/lib/utils';
import { getHashedMove, createGame } from '@/lib/contract';
import { MoveSelection } from '@/components/MoveSelection';

const formSchema = z.object({
  bet: z.string().min(1, { message: "Bet amount is required" }),
  move: z.nativeEnum(Move, { 
    required_error: "Please select a move",
    invalid_type_error: "Please select a valid move"
  }).refine(move => move !== Move.None, "Please select a move"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateGame() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [secret, setSecret] = useState<string>(generateSecret());

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bet: "0.01",
      move: Move.None,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Generate hashed move with the secret
      const hashedMove = await getHashedMove(values.move, secret);
      
      // Create the game
      await createGame({
        hashedMove,
        bet: values.bet
      });
      
      setSuccess(`Game created successfully! Keep your secret: ${secret}`);
      form.reset();
      // Generate a new secret for the next game
      setSecret(generateSecret());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create game");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Game</CardTitle>
        <CardDescription>
          Create a new Rock-Paper-Scissors game and place your bet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="bet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bet Amount (ETH)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.001" min="0.001" />
                  </FormControl>
                  <FormDescription>
                    Enter the amount of ETH you want to bet.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-muted/50 p-4 rounded-md border border-border">
              <h4 className="font-medium mb-2">Your Secret Key</h4>
              <div className="flex items-center gap-2">
                <code className="bg-background p-2 rounded text-sm flex-1 overflow-x-auto">
                  {secret}
                </code>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSecret(generateSecret())}
                >
                  Regenerate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Save this secret! You'll need it to reveal your move later.
              </p>
            </div>
            
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
              disabled={isSubmitting} 
              className="w-full bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Game...
                </>
              ) : (
                "Create Game"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}