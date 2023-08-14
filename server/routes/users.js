import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    deleteUser,
    updateProfile,
    updateProfilePicture
} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
import heicConvert from 'heic-convert';
import config from "../config/firebase.config.js"
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import User from "../models/User.js";
import { deleteFromFirebase } from "../controllers/posts.js";
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

const router = express.Router();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

/*Read*/
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/*UPDATE*/
router.patch("/updateProfilePicture/:id", verifyToken, upload.single("picture"), async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const dateTime = Date.now();
        const { originalname, buffer, mimetype } = req.file;
        let convertedBuffer = buffer;

        let targetContentType = mimetype; // Default to original mimetype
        if (mimetype === 'application/octet-stream') { //multer is detecting heic type as this
            /* Convert HEIC to JPEG using heic-convert */
            convertedBuffer = await heicConvert({
                buffer: buffer,
                format: 'JPEG', // Convert to JPEG
            });
            targetContentType = 'image/jpeg'; // Set target content type to JPEG
        } else {
            /* You can add logic here for PNG if needed */
            targetContentType = mimetype; // Set target content type to PNG
        }

        const storageRef = ref(storage, `files/${originalname + dateTime}`);
        const metadata = {
            contentType: targetContentType,
        };
        const snapshot = await uploadBytesResumable(storageRef, convertedBuffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        deleteFromFirebase(user.picturePath);
        const updatedUser = await User.findByIdAndUpdate(id, { picturePath: downloadURL }, { new: true });
        res.status(200).json(updatedUser);

    } catch (err) {
        console.log(err.message);
        res.status(404).json({ message: err.message })
    }
});
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id", verifyToken, updateProfile);

/*Delete*/
router.delete("/:id", verifyToken, deleteUser)

export default router;