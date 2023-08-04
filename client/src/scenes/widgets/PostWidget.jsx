import React from 'react';
import { ChatBubbleOutline, ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from '@mui/icons-material';
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Friend from './Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from 'state';
import moment from 'moment';

const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
    updatedAt,
    createdAt
}) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const [isComment, setIsComment] = useState(false);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    const isUpdated = updatedAt===createdAt;
    

    /*Posted Ago cal*/
    const currentMoment = moment();
    const postedMoment = moment(createdAt);

    const timeDifference = currentMoment.diff(postedMoment, 'seconds');

    const duration = moment.duration(timeDifference, 'seconds');
    const yearsAgo = duration.years();
    const monthsAgo = duration.months();
    const daysAgo = duration.days();
    const hoursAgo = duration.hours();
    const minutesAgo = duration.minutes();
    const secondsAgo = duration.seconds();

    let formattedTime = '';
    if (yearsAgo > 0) {
        formattedTime = `${yearsAgo} years ago`;
    } else if (monthsAgo > 0) {
        formattedTime = `${monthsAgo} months ago`;
    } else if (daysAgo > 0) {
        formattedTime = `${daysAgo} days ago`;
    } else if (hoursAgo > 0) {
        formattedTime = `${hoursAgo} hours ago`;
    } else if (minutesAgo > 0) {
        formattedTime = `${minutesAgo} minutes ago`;
    } else {
        formattedTime = `${secondsAgo} seconds ago`;
    }


    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const patchLike = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: loggedInUserId })
        });
        const updatedPosts = await response.json();
        dispatch(setPost({ post: updatedPosts }));
    };

    return (
        <WidgetWrapper m="2rem 0">
            <Friend
                friendId={postUserId}
                name={name}
                subtitle={location}
                userPicturePath={userPicturePath}
            />
            <Typography color={main} sx={{ mt: "1rem" }}>
                {description}
            </Typography>
            {picturePath && (
                <img
                    width="100%"
                    height="auto"
                    alt="post"
                    style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                    src={`http://localhost:3001/assets/${picturePath}`}
                />
            )}
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={()=>setIsComment(!isComment)}>
                            <ChatBubbleOutlineOutlined/>
                        </IconButton>
                        <Typography>{comments.length}</Typography>
                    </FlexBetween>
                </FlexBetween>
                <FlexBetween>
                <Typography variant='h6'>
                    {!isUpdated ? `Updated ${formattedTime}` : `Posted ${formattedTime}` } 
                </Typography>
                <IconButton>
                    <ShareOutlined />
                </IconButton>
                </FlexBetween>
            </FlexBetween>
            {isComment && (
                <Box mt="0.5rem">
                    {comments.map((comment,i) => (
                        <Box key={`${name}-${i}`}>
                            <Divider/>
                            <Typography sx={{color: main, m:"0.5rem 0", pl:"1rem"}}>
                                {comment}
                            </Typography>
                        </Box>
                    ))}
                    <Divider/>
                </Box>
            )} 
        </WidgetWrapper>
    );
};

export default PostWidget