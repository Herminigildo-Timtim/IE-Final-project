import React, { useState } from "react";
import { Button, Typography, Modal, TextField, Box } from "@mui/material";
import { toast } from "react-toastify";
import { web3 } from '@project-serum/anchor';
import { SystemProgram, PublicKey } from "@solana/web3.js";
import 'react-toastify/dist/ReactToastify.css';

function CommentModal({ open, onClose, selectedPostKey, getProvider, createCustomProgram, updateBalance, setSelectedPostComment }) {
    const [commentInput, setCommentInput] = useState('');

    const handleComment = async () => {
        if (!commentInput.trim()) {
            toast.error("Please fill out all fields!");
        } else {
            try {
                await createComment(
                    selectedPostKey,
                    commentInput,
                    getProvider,
                    createCustomProgram,
                    setCommentInput,
                    updateBalance,
                    setSelectedPostComment
                );
                toast.success("Comment Posted");
            } catch (error) {
                toast.error("Failed to post comment");
                console.error("Error posting comment:", error);
            }
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6">Comment</Typography>
                <TextField
                    variant="filled"
                    placeholder="Comment"
                    value={commentInput}
                    onChange={(event) => setCommentInput(event.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={handleComment}>
                        Comment
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default CommentModal;

export const createComment = async (selectedPostKey, commentInput, getProvider, createCustomProgram, setCommentInput, updateBalance, setSelectedPostComment) => {
    try {
      const provider = getProvider();
      const program = await createCustomProgram();
      const commentAccount = web3.Keypair.generate();
  
      await program.rpc.createComment(commentInput, {
        accounts: {
          commentAccount: commentAccount.publicKey,
          postAccount: new PublicKey(selectedPostKey),
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          clock: web3.SYSVAR_CLOCK_PUBKEY,
        },
        signers: [commentAccount],
      });
  
      console.log("Created a new CommentAccount w/ address:", commentAccount.publicKey.toString());
      setCommentInput("");
      updateBalance();
      setSelectedPostComment((prevComment) => prevComment + 1);
    } catch (error) {
      console.log("Error in creating Comment: ", error);
    }
};
