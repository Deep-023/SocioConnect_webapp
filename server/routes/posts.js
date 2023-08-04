import express from "express";
import { commentPost, getFeedPosts, getUserPosts, likePost, getCommentPosts} from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*Read*/
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId",verifyToken,getUserPosts);
router.get("/:id/comment",verifyToken,getCommentPosts);

/*Update*/
router.patch("/:id/like",verifyToken,likePost)
router.patch("/:id/comment",verifyToken,commentPost)

export default router;