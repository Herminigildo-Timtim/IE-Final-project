import React from 'react';
import { Modal, Box, Typography, Button} from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%', 
    maxWidth: 600, 
    height: 'auto', 
    maxHeight: '80vh',
    backgroundColor: 'white', 
    borderRadius: 10, 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: 5,
    overflowY: 'auto',
};

const ViewCommentModal = ({ open, handleClose, commentDetails }) => {

    const formatDate = (time) => {
        const timestamp = parseInt(time) * 1000;
        const date = new Date(timestamp);

        const formattedDate = date.toLocaleDateString('en-US');
        const formattedTime = date.toLocaleTimeString('en-US');

        const formattedDateTime = `${formattedDate} ${formattedTime}`;
        return formattedDateTime.toLocaleString();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-title" variant="h4" component="h2">
                    <strong>{commentDetails?.account?.content?.toString()}</strong>
                </Typography>
                <Typography id="modal-publickey" sx={{ mt: 1 }}>
                    Commented by: {commentDetails?.account?.user?.toString()}
                </Typography>
                <Typography id="modal-publickey" sx={{ mt: 1 }}>
                    Comment Public Key: {commentDetails?.publicKey?.toString()}
                </Typography>
                <Typography id="modal-publickey" sx={{ mt: 1 }}>
                    Date: {formatDate(commentDetails?.account?.timestamp)}
                </Typography>
                <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 , marginRight: '10px', backgroundColor: 'black', '&:hover': { cursor: 'pointer', backgroundColor: 'white', color:'black', transform: 'scale(1.05)'}}}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default ViewCommentModal;
