import React, { useEffect } from 'react';
import { DeleteOutline, ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from '@mui/icons-material';
import { Box, Divider, IconButton, Typography, useTheme, TextField } from '@mui/material';
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import FlexBetween from 'components/FlexBetween';
import Friend from './Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost, setPosts } from 'state';
import moment from 'moment';
import CommentWid from './CommentWid';
import { RWebShare } from "react-web-share";

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
    const commentCount = Object.keys(comments).length;
    const isUpdated = updatedAt === createdAt;
    const [userComment, setUserComment] = useState('');
    const commentValues = Object.values(comments);
    const [commentKeys, setCommentKeys] = useState(Object.keys(comments));


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


    const commentors = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        const updatedPosts = await response.json();
        setCommentKeys(updatedPosts);
    }

    useEffect(() => {
        commentors(); //eslint-disable-line react-hooks/exhaustive-deps 
    }, []);


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

    const patchComment = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: loggedInUserId, comment: userComment })
        });
        const updatedPosts = await response.json();
        dispatch(setPost({ post: updatedPosts }));
        commentors()
    };

    const deletePost = async () => {
        const response = await fetch(`http://localhost:3001/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        dispatch(setPosts({posts: data}));
    }

    return (
        <WidgetWrapper m="2rem 0">
            <FlexBetween>
                <Friend
                    friendId={postUserId}
                    name={name}
                    subtitle={location}
                    userPicturePath={userPicturePath}
                />
                {loggedInUserId === postUserId &&
                    <IconButton onClick={deletePost}>
                        <DeleteOutline />
                    </IconButton>}
            </FlexBetween>
            <Typography color={main} sx={{ mt: "1rem" }}>
                {description}
            </Typography>
            {picturePath && (
                <img
                    width="100%"
                    height="auto"
                    alt="post"
                    style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                    src={picturePath}
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
                        <IconButton onClick={() => setIsComment(!isComment)}>
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography>{commentCount}</Typography>
                    </FlexBetween>
                </FlexBetween>
                <FlexBetween>
                    <Typography variant='h6'>
                        {!isUpdated ? `Updated ${formattedTime}` : `Posted ${formattedTime}`}
                    </Typography>
                    <RWebShare
                        data={{
                            text: "Web Share - SocioConnect",
                            url: `http://localhost:3000/profile/${postUserId}`,
                            title: "Share Post",
                        }}
                        onClick={() => console.log("shared successfully!")}
                    >
                        <IconButton sx={{ ml: "0.5rem" }}>
                            <ShareOutlined />
                        </IconButton>
                    </RWebShare>
                </FlexBetween>
            </FlexBetween>
            {isComment && (
                <Box mt="0.5rem">
                    <FlexBetween mb={3}>
                        <TextField
                            label="Enter your comment"
                            multiline
                            variant="outlined"
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            fullWidth
                        />
                        <IconButton onClick={patchComment}>
                            <DownloadDoneOutlinedIcon />
                        </IconButton>
                    </FlexBetween>
                    <Typography variant='h4' pl={2} pb={2}>
                        Comments
                    </Typography>
                    {commentValues.map((comment, i) => (
                        <Box key={`${name}-${i}`}>
                            <CommentWid name={`${commentKeys[i]?.firstName} ${commentKeys[i]?.lastName}`}
                                picturePath={commentKeys[i].picturePath} comment={comment}
                            />
                        </Box>
                    ))}
                    <Divider />
                </Box>
            )}
        </WidgetWrapper>
    );
};

export default PostWidget