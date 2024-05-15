import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from "@mui/material/TextField";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewTopicModal ({onClose, open}){
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    // const [myTags, setMyTags] = useState([]); for when api for solana is ready
    const [openMyTags, setOpenMyTags] = useState(false);
    const [openAllTags, setOpenAllTags] = useState(false);

    const myTags = ['Science', 'Math', 'Technology'];

    useEffect(() => {
        /* API to get the tags and save the values */
    }, [])

    const handleMyTags = (event) => {
        setOpenMyTags(true);
    };

    const handleAllTags = (event) => {
        setOpenAllTags(true);
    }

    const handlePost = () => {
        if (!title || !tags.length || !description) {
            toast.error("Please fill out all fields!");
        } else {
            toast.success("Topic Posted");
        }
        onClose();
    };

    const handleTagsClose = (selectedTags) => {
        setOpenMyTags(false);
        setOpenAllTags(false);
        setTags(selectedTags);
    };

    return (
        <>
            <Modal
                open={true}
                onClose={onClose}
            >
                <Box sx={style}>
                    {/* For Topic Title */}
                    <Typography variant="h6">
                        Topic
                    </Typography>
                    <TextField
                        variant="filled"
                        placeholder="Title"
                        className="topic"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required={true}
                        style={{
                            width: '100%',
                            marginBottom: '20px',
                        }}
                    />

                    {/* Tag for the topic */}
                    <Typography style={{marginBottom: '10px'}}>
                        Tag
                    </Typography>
                    <div style={{flex: '1', flexDirection: "row"}}>
                        <Button onClick={handleMyTags} variant="contained" style={{marginRight: "20px"}}>
                            <Typography>
                                My Tags
                            </Typography>
                        </Button>
                        {openMyTags && <OwnedTags myTags={myTags} open={openMyTags} onClose={handleTagsClose} />}
                        <Button onClick={handleAllTags} variant="contained">
                            <Typography>
                                All Tags
                            </Typography>
                        </Button>
                        {openAllTags && <AllTags allTags={allTags} open={openAllTags} onClose={handleTagsClose} />}
                    </div>

                    {tags.length > 0 && (
                        <Box style={{marginTop: "10px"}}>
                            {tags.map((tag, index) => (
                                <Box key={index} sx={{ display: 'inline-block', marginRight: '10px', marginBottom: '10px' }}>
                                    <Typography variant="body1" sx={{ padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'inline-block' }}>
                                        {tag}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* For the topic description */}
                    <Typography style={{marginBottom: '10px'}}>
                        Description
                    </Typography>
                    <TextField
                        variant="filled"
                        placeholder="Topic Description"
                        className="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required={true}
                        style={{
                            width: '100%',
                            marginBottom: '20px',
                        }}
                    />

                    {/* Button for post */}
                    <Typography style={{ textAlign: 'center'}}>
                        <Button
                            variant="contained"
                            onClick={handlePost}
                            style={{
                                backgroundColor: 'white',
                                color: 'black',
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

const OwnedTags = ({ open, myTags, onClose }) => {
    const [selectedTags, setSelectedTags] = useState([]);

    // Function to handle tag click
    const handleTagClick = (tag) => {
        setSelectedTags((prevTags) => {
            if (prevTags.includes(tag)) {
                return prevTags.filter((prevTag) => prevTag !== tag);
            } else {
                return [...prevTags, tag];
            }
        });
    };

    const handleClose = () => {
        onClose(selectedTags);
    };

    return (
        <Modal open={open}>
            <Box sx={style}>
                <Typography variant="h6">Owned Tags</Typography>
                <div>
                    <div className="tag-grid">
                        {myTags.map((tag, index) => (
                            <Button
                                key={index}
                                variant={selectedTags.includes(tag) ? "contained" : "outlined"}
                                className="tag-button"
                                onClick={() => handleTagClick(tag)}
                                style={{marginRight: '10px'}}
                            >
                                {tag}
                            </Button>
                        ))}
                    </div>
                    <div style={{marginTop: '5px', display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={handleClose} variant="contained">
                            Ok
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

const AllTags = ({ open, allTags, onClose }) => {
    const [selectedTags, setSelectedTags] = useState([]);

    const handleTagClick = (tag) => {
        setSelectedTags((prevTags) => {
            if (prevTags.includes(tag)) {
                return prevTags.filter((prevTag) => prevTag !== tag);
            } else {
                return [...prevTags, tag];
            }
        });
    };

    const handleClose = () => {
        onClose(selectedTags);
    };

    return (
        <Modal open={open}>
            <Box sx={style}>
                <Typography variant="h6">All Tags</Typography>
                <div>
                    <div className="tag-grid">
                        {allTags.map((tag, index) => (
                            <Button
                                key={index}
                                variant={selectedTags.includes(tag) ? "contained" : "outlined"}
                                className="tag-button"
                                onClick={() => handleTagClick(tag)}
                                style={{marginRight: '10px'}}
                            >
                                {tag}
                            </Button>
                        ))}
                    </div>
                    <Button onClick={handleClose}>
                        Ok
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default NewTopicModal;
