import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { SystemProgram } from "@solana/web3.js";
import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import * as Web3 from "@solana/web3.js"
import { useState } from "react";

export const connectWallet = async (setWalletAddress, fetchBalance, balance) => {
  const { solana } = window;
  try {
    if (solana) {
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());

      // Move the console.log after setting the state
      fetchBalance(response.publicKey.toString());
      console.log("balance sa connect: " + fetchBalance(response.publicKey.toString()));
      console.log("Address sa connect: " + response.publicKey.toString());
      // Create a PublicKey instance after setting walletAddress
    }
  } catch (error) {
    console.log(error);
  }
};

export const getProvider = (opts) => {
  const network = clusterApiUrl('devnet');
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(
    connection,
    window.solana,
    opts.preflightCommitment,
  );
  return provider;
};

export const createCustomProgram = async (idl, opts, getProvider) => {
  const PROGRAM_ID = new PublicKey(idl.metadata.address);
  return new Program(idl, PROGRAM_ID, getProvider());
};

export const updateWalletAddress = async (setWalletAddress) => {
  try {
    const { solana } = window;
    const response = await solana.connect();
    setWalletAddress(response.publicKey.toString());
  } catch (error) {
    console.error("Error updating wallet address:", error);
  }
};

export const updateBalance = async (fetchBalance, setBalance, walletAddress) => {
  try {
    const adjustedBalance = await fetchBalance(walletAddress);
    setBalance(adjustedBalance);
  } catch (error) {
    console.error("Error updating balance:", error);
  }
};

export const postList = async (createCustomProgram) => {
  try {
    const program = await createCustomProgram();
    const accounts = await program.account.postAccount.all(); // Fetch all post accounts
    return accounts;
  } catch (error) {
    console.log("Error in postList: ", error);
    return [];
  }
};

export const commentList = async (createCustomProgram) => {
  try {
    const program = await createCustomProgram();
    const accounts = await program.account.commentAccount.all(); // Fetch all post accounts
    return accounts;
  } catch (error) {
    console.log("Error in commentList: ", error);
    return [];
  }
};

// export const createComment = async (content, selectedPostKey, commentInput, getProvider, createCustomProgram, setCommentInput, updateBalance, postList, commentList, setSelectedPostComment) => {
//   try {
//     // Check if the content is empty or ""
//     if (!content || content.trim() === "") {
//       console.log("Content is empty. Comment not created.");
//       return;
//     }

//     const provider = getProvider();
//     const program = await createCustomProgram();

//     const commentAccount = web3.Keypair.generate();

//     await program.rpc.createComment(content, {
//       accounts: {
//         commentAccount: commentAccount.publicKey,
//         postAccount: new PublicKey(selectedPostKey),
//         authority: provider.wallet.publicKey,
//         systemProgram: SystemProgram.programId,
//         clock: web3.SYSVAR_CLOCK_PUBKEY,
//       },
//       signers: [commentAccount],
//     });

//     console.log("Created a new CommentAccount w/ address:", commentAccount.publicKey.toString());
//     setCommentInput("");
//     updateBalance();
//     postList();
//     commentList();
//     setSelectedPostComment((prevComment) => prevComment + 1);
//   } catch (error) {
//     console.log("Error in creating Comment: ", error);
//   }
// };

export const commentsList = async (selectedPostKey, getProvider, createCustomProgram, postList, commentList, setSelectedPostComment) => {
  try {
    const provider = getProvider();
    const program = await createCustomProgram();

    const commentAccount = web3.Keypair.generate();

    await program.rpc.commentsList({
      accounts: {
        commentAccount: commentAccount.publicKey,
        postAccount: new PublicKey(selectedPostKey),
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
      },
      signers: [commentAccount],
    });

    postList();
    commentList();
    setSelectedPostComment((prevComment) => prevComment + 1);
  } catch (error) {
    console.log("Error in creating Comment: ", error);
  }
};

export const votePost = async (selectedPostKey, getProvider, createCustomProgram, commentList, postList, updateWalletAddress, updateBalance, setSelectedPostVote) => {
  try {
    const program = await createCustomProgram();
    await program.rpc.votePost({
      accounts: {
        postAccount: new PublicKey(selectedPostKey),
      },
    });

    console.log("Voted for the post.");
    commentList();
    postList();
    updateWalletAddress();
    updateBalance();
    setSelectedPostVote((prevVote) => prevVote + 1);
  } catch (error) {
    console.log("Error in voting for the post: ", error);
  }
};

export const viewTransaction = (walletAddress) => {
  if (walletAddress) {
    const explorerUrl = `https://explorer.solana.com/address/${walletAddress}?cluster=devnet`;
    window.open(explorerUrl, "_blank"); // Open the URL in a new tab or window
  }
};

export const convertSolanaTimestampToDateTime = (solanaTimestamp) => {
  const timestamp = new Date(solanaTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  const formattedDate = timestamp.toLocaleString('en-US', dateOptions);
  const formattedTime = timestamp.toLocaleString('en-US', timeOptions);

  return (
    <>
      {formattedDate}
      <br />
      {formattedTime}
    </>
  );
};

export const fetchBalance = async (walletAddress) => {
  try {
    const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
    const publicKeyObj = new Web3.PublicKey(walletAddress);
    const solBalance = await connection.getBalance(publicKeyObj);
    // Divide the balance by 1,000,000,000
    const adjustedBalance = solBalance / 1000000000;
    return adjustedBalance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};

export const handleSearchInput = (e, setSearchText) => {
  setSearchText(e.target.value);
};

export const handleCommentInputChange = (e, setCommentInput) => {
  setCommentInput(e.target.value);
};

export const handleTopicInputChange = (e, setTopicInput) => {
  setTopicInput(e.target.value);
};
