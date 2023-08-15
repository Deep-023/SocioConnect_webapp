import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { setUpdatedUser, setPosts } from 'state';

const BlurredBackground = styled(Dialog)`
  backdrop-filter: blur(2px);
`;

const EditImage = ({ profileImage, setProfileImage }) => {
    const { picturePath, _id } = useSelector((state) => state.user);
    const user = useSelector((state) => state.user);
    const token = useSelector((state)=>state.token);
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState(picturePath);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setSelectedImageUrl(URL.createObjectURL(file));
    };

    const updateProfileImage = async() =>{
        const formData = new FormData();
        formData.append("picture", selectedFile);
        const response = await fetch(`http://localhost:3001/users/updateProfilePicture/${_id}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`},
            body: formData
        });
        const data = await response.json();
        dispatch(setUpdatedUser({user:data.updatedUser}));
        dispatch(setPosts({posts:data.updatedPosts}));
        setProfileImage(false);
    }

    return (
        <div>
            <BlurredBackground open={profileImage} onClose={() => setProfileImage(false)}>
                <DialogTitle textAlign="center" fontSize={18}>Change Image</DialogTitle>
                <DialogContent sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                    <DialogContentText>
                        Are you sure you want to change your profile picture?
                    </DialogContentText>
                    <Box width="250px" height="250px" mt={3} mb={2}>
                        <img src={selectedImageUrl} style={{ objectFit: "cover", borderRadius: "50%" }}
                            alt="userImage" width="250px" height="250px"
                        />
                    </Box>
                    <label style={{ fontSize: "16px", cursor: "pointer", color: "primary" }} >
                        <input type="file" style={{ display: "none" }} onChange={handleFileChange} accept="image/*"/>
                        Choose Image
                    </label>
                    {selectedFile &&
                        <DialogContentText mt={1}>
                            Selected File: {selectedFile.name}
                        </DialogContentText>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setProfileImage(false)} color="primary">
                        Cancel
                    </Button>
                    <Button color="secondary" onClick={updateProfileImage}>
                        Confirm
                    </Button>
                </DialogActions>
            </BlurredBackground>
        </div>
    )
}

export default EditImage