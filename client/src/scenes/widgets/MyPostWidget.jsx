import React from 'react'
import { EditOutlined, DeleteOutline, AttachFileOutlined, GifBoxOutlined, ImageOutlined, MicOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { Box,Typography,Divider, InputBase, useTheme, Button, IconButton, useMediaQuery } from '@mui/material';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';
import UserImage from 'components/UserImage';
import WidgetWrapper from 'components/WidgetWrapper';
import { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';

const MyPostWidget = ({picturePath}) => {
  const dispatch = useDispatch();
  const[isImage, setIsImage]= useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const {palette} = useTheme();
  const {_id} = useSelector((state)=>state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async (e) => {
    const formData = new FormData();
    formData.append("userId",_id);
    formData.append("description",post);
    if(image){
        formData.append("picture",image);
        formData.append("picturePath",image.name);
    }

    const response = await fetch(`http://localhost:3001/posts`,{
        method:"POST",
        headers: {Authorization: `Bearer ${token}`},
        body:formData
    });

    const posts = await response.json();
    dispatch(setPost({posts}));
    setImage(null);
    setPost("");
  };

  return(
    <WidgetWrapper>
        <FlexBetween
        gap="1.5rem"
        >
        <UserImage image={picturePath}/>
        <InputBase
            placeholder="What's on your mind..."
            onChange={(e)=> setPost(e.target.value)}
            value={post}
            sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "1rem 2rem"
            }}
        />
        </FlexBetween>
        {isImage && (
            <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
            >
            <Dropzone>

            </Dropzone>
            </Box>
        )}
    </WidgetWrapper>
  )

};

export default MyPostWidget