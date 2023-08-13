import React from 'react'
import Navbar from 'scenes/navbar/Navbar'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { useSelector } from 'react-redux';
import UserWidget from 'scenes/widgets/UserWidget';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import Form from 'scenes/loginPage/Form';
import EditForm from './EditForm';
import WidgetWrapper from 'components/WidgetWrapper';

const EditProfile = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const { _id, picturePath } = useSelector((state) => state.user)
    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 15%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-around"
            >
                <Box flexBasis={isNonMobileScreens ? "36%" : undefined} mb={5}>
                    <UserWidget userId={_id} picturePath={picturePath} />
                    <Box m="2rem 0" />
                    <FriendListWidget userId={_id} />
                </Box>

                <Box>
                    <WidgetWrapper>
                        <Typography variant='h1' color="primary" textAlign="center" mb={5} mt={1}>
                            Edit Profile
                        </Typography>
                        <EditForm />
                    </WidgetWrapper>
                </Box>
            </Box>
        </Box>
    )
}

export default EditProfile