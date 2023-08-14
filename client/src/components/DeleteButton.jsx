import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/system';

const BlurredBackground = styled(Dialog)`
  backdrop-filter: blur(2px);
`;

const DeleteButton = ({ onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  return (
    <div>
      <Button fullWidth sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        pl: "15px",
        textTransform: "none",
        fontWeight:100,
        fontSize:"0.9rem"
      }}
      color="inherit"
      onClick={() => setOpen(true)}
      >
        Delete User
      </Button>
      <BlurredBackground open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </BlurredBackground>
    </div>
  );
};

export default DeleteButton;
