import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateGame } from "@/components/CreateGame";
import { JoinGame } from "@/components/JoinGame";
import { RevealMove } from "@/components/RevealMove";
import { GameList } from "@/components/GameList";

export default function Home() {
  return (
    <div className="container max-w-screen-xl py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Play Rock Paper Scissors on the Blockchain
            </h1>
            <p className="mt-4 text-muted-foreground">
              A decentralized game of Rock Paper Scissors with ETH betting. Create a game, select your move, and challenge others to match your bet.
            </p>
          </div>
          
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create Game</TabsTrigger>
              <TabsTrigger value="join">Join Game</TabsTrigger>
              <TabsTrigger value="reveal">Reveal Move</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <CreateGame />
            </TabsContent>
            <TabsContent value="join">
              <JoinGame />
            </TabsContent>
            <TabsContent value="reveal">
              <RevealMove />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <GameList />
        </div>
      </div>
    </div>
  );
}