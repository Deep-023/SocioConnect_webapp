import React from 'react'
import { useTheme, Typography, Box } from '@mui/material'

const CommentWid = ({name, picturePath , comment}) => {
    const {palette} = useTheme();
    return (
        <Box backgroundColor={palette.neutral.light} mb={1} p="0.3rem 1rem" alignItems='center'
            borderRadius= "0.75rem" display='flex' flexDirection='row'>
            <img src={picturePath} style={{objectFit: "cover", borderRadius:"50%"}}
                width="40px" height="40px" alt="user"
            />
            <Box ml={1.5}>
                <Typography variant='h5'>{name}</Typography>
                <Typography variant='subtitle1' fontWeight={100}>{comment.charAt(0).toUpperCase() + comment.slice(1)}</Typography>
            </Box>

        </Box>
    )

}

export default CommentWid