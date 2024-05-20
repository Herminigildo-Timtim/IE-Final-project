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

const ViewPostDetailsModal = ({ open, handleClose, postsDetails }) => {
    
    const formatDate = (time) => {
        const timestamp = parseInt(time) * 1000;
        const date = new Date(timestamp);

        const formattedDate = date.toLocaleDateString('en-US');
        const formattedTime = date.toLocaleTimeString('en-US');

        const formattedDateTime = `${formattedDate} ${formattedTime}`;
        console.log(postsDetails);
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
                    <strong>{postsDetails?.account?.name?.toString()}</strong>
                </Typography>
                <Typography id="modal-publickey" sx={{ mt: 1 }}>
                    Posted by: {postsDetails?.account?.authority?.toString()}
                </Typography>
                <Typography id="modal-publickey" sx={{ mt: 1 }}>
                    Post Public Key: {postsDetails?.publicKey?.toString()}
                </Typography>
                <Typography id="modal-publickey" sx={{ mt: 1 }}>
                    Date: {formatDate(postsDetails?.account?.timestamp)}
                </Typography>
                <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default ViewPostDetailsModal;
