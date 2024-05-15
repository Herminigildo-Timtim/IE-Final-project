import { Typography, Modal, TextField, Button, Box } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function CommentModal({open, onClose}){
    const [comment, setComment] = useState('');

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    }

    const handleComment = (event) => {
        if (!comment) {
            toast.error("Please fill out all fields!");
        } else {
            toast.success("Comment Posted");
        }
        onClose();
    }

    return (
        <>
            <Modal
                open={true}
                onClose={onClose}>
                <Box sx={style}>
                    <Typography>
                        Comment
                    </Typography>
                    <TextField
                        variant="filled"
                        placeholder="Comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        required={true}
                        style={{
                            width: '100%',
                            marginBottom: '20px',
                        }}/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Button
                            variant="contained"
                            onClick={handleComment}>
                            Comment
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>
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