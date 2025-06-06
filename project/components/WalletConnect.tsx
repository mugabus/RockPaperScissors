"use client";

import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet } from 'lucide-react';
import { formatAddress } from '@/lib/utils';

export function WalletConnect() {
  const { address, balance, isConnected, isConnecting, error, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end text-sm">
            <span className="font-medium">{formatAddress(address!)}</span>
            <span className="text-muted-foreground">{balance?.substring(0, 6)} ETH</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            className="border-primary/20 hover:bg-primary/10"
          >
            <Wallet className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Disconnect</span>
            <span className="md:hidden">Wallet</span>
          </Button>
        </div>
      ) : (
        <Button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      )}
      
      {error && (
        <p className="text-destructive text-sm">
          {error.message}
        </p>
      )}
    </div>
  );
}