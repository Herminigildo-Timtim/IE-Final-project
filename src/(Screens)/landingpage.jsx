import React, { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import { connectWallet, fetchBalance } from "../functions/functions.jsx";
import "../(Components)/css/LandingPage.css";
import first from "../(Components)/images/first.svg";
import second from "../(Components)/images/second.svg";
import { Link } from "react-router-dom";

function LandingPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);

  const handleConnectWallet = async () => {
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
    <div style={{ maxWidth: "auto"}}>
        <div className="Header">
            <Link style={{ textDecoration: "none", color: "black"}}> About </Link>
        </div>
        <Grid container sx={{ height: 'auto' }} className="container">
            <Grid item xs={6} container direction="column" justifyContent="center" alignItems="center">
              <img src={first} style={{ minHeight: "300px"}} alt="Lego"/>
            </Grid>
            <Grid item xs={6} className="first" justifyContent="center" container direction="column">
                <div style={{ alignItems: "left", justifyContent: "left", paddingLeft: "50px"}}>
                  <Typography variant="h3" fontWeight="bold">
                    BlockChain
                  </Typography>
                  <Typography variant="h3" fontWeight="bold">
                    BlokcNote
                  </Typography>
                  <pre className="sub-motto">
                      Join the decentralized community - discuss, share,<br />
                      and upvote content
                  </pre>
                </div>
                <Grid item container direction="column" alignItems="center" justifyContent="center">
                  <button onClick={handleConnectWallet}>
                  Connect Solana Wallet
                  </button>
                </Grid>
            </Grid>
        </Grid>

        <Grid container sx={{ height: 'auto' }} className="container2" >
          <Grid item container direction="row" justifyContent="space-evenly">
              <Typography variant="h6" textAlign="center">
                Current Users <br/>
                {/* count of Users */}
                58694
              </Typography> 

              <Typography variant="h6" textAlign="center">
                Current Topics <br/>
                {/* count of posted topics */}
                1500
              </Typography>

              <Typography variant="h6" textAlign="center">
                Current Upvotes <br/>
                {/* count of total upvotes */}
                486953
              </Typography> 

          </Grid>
        </Grid>

        <Grid container sx={{ height: "80vh" }} className="container3">
          <Grid item xs={6} container direction="column" justifyContent="center" alignItems="flex-start" className="second">
            <Typography variant="h3" fontWeight="bold">
              BlockChain-based <br />
              Community Platform
            </Typography>
            <pre className="sub-motto">
              Decentralized community with global reach<br />
              and low fees for all users
            </pre>
          </Grid>

          <Grid item xs={6} container justifyContent="center" alignItems="center">
            <img src={second} style={{ minHeight: "350px" }} alt="Robot" />
          </Grid>
        </Grid>

        <Grid className="foot" container justifyContent="center">
            <Link className="link"> Help </Link>
            <Link className="link"> Contact Support </Link>
            <Link className="link"> FAQs </Link>
        </Grid>
           
    </div>
  );
}

export default LandingPage;