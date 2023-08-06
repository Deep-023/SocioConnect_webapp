import Post from "../models/Post.js"
import User from "../models/User.js";
import admin from 'firebase-admin';
import serviceAccount from '../config/socioconnect-1acff-firebase-adminsdk-wnwlm-0a8f833b69.js'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
// Other configuration options if needed

const storage = admin.storage();

export const deleteFromFirebase = (url) => {
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/socioconnect-1acff.appspot.com/o/";
    let imagePath = url.replace(baseUrl, "");
    const indexOfEndPath = imagePath.indexOf("?");
    imagePath = imagePath.substring(0, indexOfEndPath);
    imagePath = imagePath.replace("%2F", "/");
    console.log(imagePath);
    storage.bucket("socioconnect-1acff.appspot.com").file(imagePath).delete().catch((err) => console.error(err));
}
/*export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        console.log(err.message);
        res.status(409).json({ message: err.message })
    }
}*/


/*READ*/
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/*Update*/
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true)
        }

        const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true, timestamps: false });
        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, comment } = req.body;
        const post = await Post.findById(id);

        post.comments.set(userId, comment)

        const updatedPost = await Post.findByIdAndUpdate(id, { comments: post.comments }, { new: true, timestamps: false });
        res.status(200).json(updatedPost);

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getCommentPosts = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        const commentKeys = Array.from(post.comments.keys());
        const commentors = await Promise.all(
            commentKeys.map((i) => User.findById(i))
        );

        const formattedCommentors = commentors.map(
            ({ firstName, lastName, picturePath }) => {
                return { firstName, lastName, picturePath }
            });
        res.status(200).json(formattedCommentors);

    } catch (err) {
        console.log(err.message);
        res.status(404).json({ message: err.message })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const delpost = await Post.findById(id);
        const url = delpost.picturePath;

        await Post.findByIdAndDelete(id);

        deleteFromFirebase(url);

        const post = await Post.find();
        res.status(200).json(post);

    } catch (err) {
        console.log(err.message)
        res.status(404).json({ message: err.message })
    }
}