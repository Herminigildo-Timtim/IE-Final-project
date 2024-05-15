import React, { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { connectWallet, fetchBalance } from "./functions";

function LandingPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);

  const handleConnectWallet = async () => {
    // Call connectWallet function from functions.jsx
    await connectWallet(setWalletAddress, (walletAddress) => {
      fetchBalance(walletAddress)
        .then((adjustedBalance) => {
          setBalance(adjustedBalance);
        })
        .catch((error) => {
          console.error("Error fetching balance:", error);
        });
    });
  };

  return (
    <>
        <div>
            H
        </div>
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={6}>
                {/* Your image */}
            </Grid>
            <Grid item xs={6} container direction="column" alignItems="center" justifyContent="center">
                <Typography variant="h4" gutterBottom>
                Connect to Solana Wallet
                </Typography>
                <Button variant="contained" onClick={handleConnectWallet}>
                Connect
                </Button>
            </Grid>
        </Grid>
    </>
  );
}

export default LandingPage;