"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '@/lib/types';

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    chainId: null,
    balance: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        error: new Error("No Ethereum wallet detected. Please install MetaMask.")
      }));
      return;
    }

    try {
      setWalletState(prev => ({ ...prev, isConnecting: true }));
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      
      // Get network
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      // Get balance
      const balanceWei = await provider.getBalance(address);
      const balance = ethers.formatEther(balanceWei);
      
      setWalletState({
        address,
        chainId,
        balance,
        isConnected: true,
        isConnecting: false,
        error: null,
      });
      
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error : new Error("Failed to connect wallet")
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      chainId: null,
      balance: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else if (walletState.address !== accounts[0]) {
        // Account changed, update state
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      // Chain changed, reload the page as recommended by MetaMask
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet();
          }
        })
        .catch(console.error);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [connectWallet, disconnectWallet, walletState.address]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet
  };
}