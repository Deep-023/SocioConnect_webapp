import User from "../models/User.js";
import { deleteFromFirebase } from "./posts.js";
import Post from "../models/Post.js";

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
        console.log(err.message);
        res.status(404).json({ message: err.message })
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

