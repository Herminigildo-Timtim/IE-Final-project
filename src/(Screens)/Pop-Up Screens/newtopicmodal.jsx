import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { web3 } from "@project-serum/anchor";
import { SystemProgram } from "@solana/web3.js";

function NewTopicModal({ onClose, open, getProvider, createCustomProgram }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  const handlePost = async () => {
    if (!title || !tags.length || !description) {
      toast.error("Please fill out all fields!");
    } else {
      try {
        await createPost(
          getProvider,
          createCustomProgram,
          title,
          description,
          tags
        );
        toast.success("Topic Posted");
        onClose();
      } catch (error) {
        toast.error("Failed to post topic");
        console.error("Error creating post:", error);
      }
    }
  };

  const createPost = async (
    getProvider,
    createCustomProgram,
    title,
    description,
    tags
  ) => {
    try {
      const provider = getProvider();
      const program = await createCustomProgram();
      const postAccount = web3.Keypair.generate();

      await program.rpc.initPost(title, description, tags.join(","), {
        accounts: {
          postAccount: postAccount.publicKey,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          clock: web3.SYSVAR_CLOCK_PUBKEY,
        },
        signers: [postAccount],
      });

      console.log(
        "Created a new PostAccount w/ address:",
        postAccount.publicKey.toString()
      );
      setTitle("");
      setDescription("");
      setTags([]);

      // Call AddTag function after creating post
      for (const tag of tags) {
        await addTag(provider, program, postAccount, tag);
      }
    } catch (error) {
      console.log("Error in creating PostAccount: ", error);
    }
  };

  const addTag = async (provider, program, postAccount, tagName) => {
    try {
      console.log("Generating keypair for tag account...");
      const tagAccount = web3.Keypair.generate();
      console.log("Generated keypair:", tagAccount);

      await program.rpc.addTag(tagName, {
        accounts: {
          tagAccount: tagAccount.publicKey,
          postAccount: postAccount.publicKey,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          clock: web3.SYSVAR_CLOCK_PUBKEY,
        },
        signers: [tagAccount],
      });

      console.log(
        "Tag associated with address:",
        tagAccount.publicKey.toString()
      );
    } catch (error) {
      console.log("Error in creating TagAccount: ", error);
    }
  };

  const handleAddTag = () => {
    if (tag.trim() !== "") {
      setTags([...tags, tag]);
      setTag("");
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          {/* For Topic Title */}
          <Typography variant="h6">Topic</Typography>
          <TextField
            variant="filled"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: "20px",
            }}
          />

          {/* Tag for the topic */}
          <Typography style={{ marginBottom: "10px" }}>Tag</Typography>
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              variant="filled"
              placeholder="Add Tag"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              required
              style={{
                flex: 1,
                marginBottom: "20px",
              }}
            />
            <Button onClick={handleAddTag}>Add Tag</Button>
          </Box>

          {tags.length > 0 && (
            <Box style={{ marginTop: "10px" }}>
              {tags.map((tag, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "inline-block",
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      padding: "8px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                      display: "inline-block",
                    }}
                  >
                    {tag}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* For the topic description */}
          <Typography style={{ marginBottom: "10px" }}>Description</Typography>
          <TextField
            variant="filled"
            placeholder="Topic Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            style={{
              width: "100%",
              marginBottom: "20px",
            }}
          />

          {/* Button for post */}
          <Typography style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={handlePost}
              style={{
                backgroundColor: "white",
                color: "black",
              }}
            >
              POST
            </Button>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default NewTopicModal;
