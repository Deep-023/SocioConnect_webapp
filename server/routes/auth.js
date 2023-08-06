import express from "express";
import {login} from "../controllers/auth.js"
import { verifyToken } from "../middleware/auth.js";
import {initializeApp} from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import multer from "multer";
import config from "../config/firebase.config.js"
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();
/*Initialising firebase*/
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

//handling the Auth
router.post("/register", upload.single("picture"), async (req, res) => {
    try{
        const dateTime = Date.now();
        const storageRef = ref(storage, `files/${req.file.originalname + dateTime}`);
        const metadata = {
            contentType: req.file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const { firstName, lastName, email, password, friends, location, occupation } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath : downloadURL,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.post("/login", login);

export default router;