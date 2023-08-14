import User from "../models/User.js";
import { deleteFromFirebase } from "./posts.js";
import Post from "../models/Post.js";
import heicConvert from 'heic-convert';
import config from "../config/firebase.config.js"
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

/*Read*/
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/*Update*/
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        console.log(friendId);
        const friend = await User.findById(friendId);
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        );

        res.status(200).json(formattedFriends);

    } catch (err) {
        console.log(err.message)
        res.status(404).json({ message: err.message })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, location, occupation } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { firstName: firstName, lastName: lastName, location: location, occupation: occupation }, { new: true });
        res.status(200).json(updatedUser);

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const updateProfilePicture = async(req,res) => {
    try{
        const {id} = req.params;
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

    }catch(err){
        res.status(404).json({message:err.message})
    }
}

/*Delete User*/
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        await User.updateMany(
            { friends: id },
            { $pull: { friends: id } }
        );

        const deletedPosts = await Post.find({ userId: id });
        const deletePostsResult = await Post.deleteMany({ userId: id });
        for (const post of deletedPosts) {
            if (post.picturePath) {
                // Delete the image from Firebase Storage
                deleteFromFirebase(post.picturePath);
            }
        }
        deleteFromFirebase(user.picturePath)
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.log(err.message)
        res.status(404).json({ message: err.message });
    }
}

