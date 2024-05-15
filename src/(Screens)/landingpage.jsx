import React, { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import * as Web3 from '@solana/web3.js';
import { Buffer } from "buffer";
import { clusterApiUrl } from "@solana/web3.js";

window.Buffer = Buffer;
const network = clusterApiUrl('devnet');

function LandingPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);

  const fetchBalance = async (walletAddress) => {
    try {
      const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
      const publicKeyObj = new Web3.PublicKey(walletAddress);
      const solBalance = await connection.getBalance(publicKeyObj);
      // Divide the balance by 1,000,000,000
      const adjustedBalance = solBalance / 1000000000;
      setBalance(adjustedBalance); // Update the balance state here
      return adjustedBalance;
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    try {
      if (solana) {
        const response = await solana.connect();
        setWalletAddress(response.publicKey.toString());

        fetchBalance(response.publicKey.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window?.solana?.isPhantom) {
        // Check if the wallet is connected
        if (window.solana.publicKey) {
          // Disconnect from the wallet
          await window.solana.disconnect();
  
          // Clear wallet-related state
          setWalletAddress(null);
          setBalance(null);
  
          // Log a message for successful disconnection
          console.log("Disconnected from Phantom wallet.");
        } else {
          // Wallet is already disconnected
          console.log("Phantom wallet is already disconnected.");
        }
      } else {
        alert("Phantom wallet not found.");
      }
    } catch (error) {
      console.error("Error disconnecting Phantom wallet:", error);
    }
  };

  return (
    <>
        <div>
            H
        </div>
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={6}>
                <img
                // src="https://via.placeholder.com/800"
                alt="placeholder"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </Grid>
            <Grid item xs={6} container direction="column" alignItems="center" justifyContent="center">
                <Typography variant="h4" gutterBottom>
                Connect to Solana Wallet
                </Typography>
                <Button variant="contained" onClick={connectWallet}>
                Connect
                </Button>
                {walletAddress && (
                <>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                    Wallet Address: {walletAddress}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                    Balance: {balance} SOL
                    </Typography>
                </>
                )}
            </Grid>
        </Grid>
    </>
  );
}

export default LandingPage;