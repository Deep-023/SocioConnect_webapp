import express from "express";
import { commentPost, getFeedPosts, getUserPosts, likePost, getCommentPosts} from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js";
import {initializeApp} from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import multer from "multer";
import config from "../config/firebase.config.js"
import User from "../models/User.js";
import Post from "../models/Post.js";

const router = express.Router();
/*Initialising firebase*/
initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });


/*CREATE*/
router.post("/", verifyToken, upload.single("picture"), async (req, res) => {
    try{
        const dateTime = Date.now();
        const storageRef = ref(storage, `files/${req.file.originalname + " " + dateTime}`);
        const metadata = {
            contentType: req.file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath: downloadURL,
            likes: {},
            comments: []
        })
        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);
    }
    catch{
        console.log(err.message);
        res.status(409).json({ message: err.message })
    }
});


/*Read*/
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId",verifyToken,getUserPosts);
router.get("/:id/comment",verifyToken,getCommentPosts);

/*Update*/
router.patch("/:id/like",verifyToken,likePost)
router.patch("/:id/comment",verifyToken,commentPost)

export default router;