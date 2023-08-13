import React from 'react'
import { Box, Button, useMediaQuery, TextField, useTheme} from '@mui/material'
import { Formik } from 'formik' //form lib
import * as yup from "yup"; //validation lib
import { useSelector, useDispatch } from 'react-redux';
import { setUpdatedUser } from 'state';
import { useNavigate } from 'react-router-dom';


const EditSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
});

const EditForm = () => {
    const token = useSelector((state)=>state.token);
    const navigate = useNavigate();
    const { _id, firstName, lastName, email, location, occupation } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const initialValuesEdit = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        location: location,
        occupation: occupation,
    };
    const isNonMobileScreens = useMediaQuery("(min-width: 600px)")
    const { palette } = useTheme();

    const handleFormSubmit = async (values, onSubmitProps) => {
        const updatedUserResponse = await fetch(`http://localhost:3001/users/${_id}`,
            {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }
        );
        const updatedUser = await updatedUserResponse.json();
        onSubmitProps.resetForm();
        dispatch(setUpdatedUser({user: updatedUser}));
        navigate(0);
    }

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValuesEdit}
            validationSchema={EditSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="25px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobileScreens ? undefined : "span 4" }, //this will override inner textfields on smaller screens 
                        }}
                        m="0px 18px 45px 18px"
                    >
                        <TextField label="First Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            name="firstName" //align with schema 
                            error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField label="Last Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            name="lastName" //align with schema 
                            error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                            sx={{ gridColumn: "span 2" }}
                        />
                        <TextField label="Location"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.location}
                            name="location" //align with schema 
                            error={Boolean(touched.location) && Boolean(errors.location)}
                            helperText={touched.location && errors.location}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField label="Occupation"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.occupation}
                            name="occupation" //align with schema 
                            error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                            helperText={touched.occupation && errors.occupation}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email" //align with schema 
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            sx={{ gridColumn: "span 4" }}
                            disabled
                        />
                    </Box>
                    <Box textAlign="center" mb={5}>
                        <Button
                            type="submit"
                            sx={{
                                m: "1rem 0",
                                p: "1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main },
                            }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default EditForm